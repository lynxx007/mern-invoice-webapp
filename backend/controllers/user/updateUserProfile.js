import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";


const updateUserProfile = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id

    const { password, passwordConfirm, email, isEmailVerified, provider, roles, googleID, username } = req.body

    const user = await User.findById(userId)

    if (!user) {
        res.status(400)
        throw new Error("User not found")
    }

    if (password || passwordConfirm) {
        res.status(400)
        throw new Error('The route is not for password updates. Please use the password reset functionality.')
    }

    if (email || isEmailVerified || roles || googleID || provider) {
        res.status(400)
        throw new Error('You are not allowed to update that field on this route')
    }

    const fieldToUpdate = req.body
    const updatedProfile = await User.findByIdAndUpdate(userId, { ...fieldToUpdate }, {
        new: true,
        runValidators: true,
        select: '-refreshToken'
    })
    res.status(200).json({
        success: true,
        message: `${user.firstName}, your profile was successfully updated`,
        updatedProfile
    })

})

export default updateUserProfile