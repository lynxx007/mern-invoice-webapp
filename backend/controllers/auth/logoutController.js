import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

const logoutUser = expressAsyncHandler(async (req, res) => {
    const cookie = req.cookies

    if (!cookie?.jwt) {
        res.status(204)
        throw new Error("No cookie found")
    }

    const refreshToken = cookie.jwt

    const existingUser = await User.findOne({ refreshToken })

    if (!existingUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.status(204)
    }

    existingUser.refreshToken = existingUser.refreshToken.filter(token => token !== refreshToken)
    await existingUser.save()

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.status(200).json({
        success: true,
        message: `${existingUser.firstName}, you have been logged out successfully`
    })

})

export default logoutUser