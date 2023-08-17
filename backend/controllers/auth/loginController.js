import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from '../../models/userModel.js';
import { systemLogs } from "../../utils/Logger.js";
import 'dotenv/config.js'



const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please provide email and password')
    }

    const existingUser = await User.findOne({ email }).select('+password')

    if (!existingUser || !(await existingUser.comparePassword(password))) {
        res.status(401)
        systemLogs.error('Incorrect email or password')
        throw new Error('Incorrect email or password')
    }

    if (!existingUser.isEmailVerified) {
        res.status(401)
        systemLogs.error('Email not verified')
        throw new Error('Email not verified')
    }

    if (!existingUser.active) {
        res.status(400)
        throw new Error('You have been deactivated by the admin and login is impossible. Contact us for enquiries.')
    }

    if (existingUser && (await existingUser.comparePassword(password))) {
        const payloadAccessToken = {
            id: existingUser._id,
            roles: existingUser.roles
        }

        const payloadRefreshToken = {
            id: existingUser._id,
        }


        const accessToken = jwt.sign(payloadAccessToken, process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: "1h"
        })

        const newRefreshToken = jwt.sign(payloadRefreshToken, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: "1d"
        })

        let newRefreshTokenArr = !req.cookies?.jwt
            ? existingUser.refreshToken
            : existingUser.refreshToken.filter(refToken => refToken !== req.cookies.jwt)

        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt
            const existingRefreshToken = await User.findOne({ refreshToken: refreshToken }).exec()

            if (!existingRefreshToken) {
                newRefreshTokenArr = []
            }

            const options = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'none'
            }
            res.clearCookie('jwt', options)
        }

        existingUser.refreshToken = [...newRefreshTokenArr, newRefreshToken]
        await existingUser.save()

        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
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

    } else {
        res.status(401)
        throw new Error('Invalid credentials provided')
    }
})

export default loginUser