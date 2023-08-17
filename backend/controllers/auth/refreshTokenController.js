import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config.js'



const newAccessToken = expressAsyncHandler(async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.sendStatus(401)
    }

    const refreshToken = cookies.jwt

    const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true,
        sameSite: 'none'
    }
    res.clearCookie('jwt', options)

    const existingUser = await User.findOne({ refreshToken: refreshToken }).exec()

    if (!existingUser) {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.sendStatus(403)
            }

            const hackedUser = await User.findOne({ _id: decoded.id }).exec()
            hackedUser.refreshToken = []
            await hackedUser.save()
        })
        return res.sendStatus(403)
    }

    const newRefreshTokenArr = existingUser.refreshToken.filter(refToken => refToken !== refreshToken)

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
        if (err) {
            existingUser.refreshToken = [...newRefreshTokenArr]
            await existingUser.save()
        }

        if (err || existingUser._id.toString() !== decoded.id) {
            return res.sendStatus(403)
        }

        const accessToken = jwt.sign({
            id: existingUser._id,
            roles: existingUser.roles
        },
            process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: '1h'
        })

        const newRefreshToken = jwt.sign({
            id: existingUser._id
        },
            process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: '1d'
        })

        existingUser.refreshToken = [...newRefreshTokenArr, newRefreshToken]
        await existingUser.save()

        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            secure: true,
            sameSite: 'none'
        }
        res.cookie('jwt', newRefreshToken, options)

        res.json({
            success: true,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
            accessToken
        })
    })

})

export default newAccessToken