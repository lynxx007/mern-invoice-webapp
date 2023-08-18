import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmails.js";
import expressAsyncHandler from "express-async-handler";
import 'dotenv/config';

const domainUrl = process.env.DOMAIN
const { randomBytes } = await import('crypto')

const resetPasswordRequest = expressAsyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        res.status(400)
        throw new Error('Email is required')
    }

    const existingUser = await User.findOne({ email }).select('-passwordConfirm')

    if (!existingUser) {
        res.status(400)
        throw new Error('The email is not associated with any account')
    }

    let verificationToken = await VerifyResetToken.findOne({ _userId: existingUser._id })

    if (verificationToken) {
        await verificationToken.deleteOne()
    }

    const resetToken = randomBytes(32).toString('hex')

    let newVerificationToken = await new VerifyResetToken({
        _userId: existingUser._id,
        token: resetToken,
        createdAt: Date.now()
    }).save()

    if (existingUser && existingUser.isEmailVerified) {
        const emailLink = `${domainUrl}/auth/reset_password?emailToken=${newVerificationToken.token}&userId=${existingUser._id}`
        const payload = {
            name: existingUser.firstName,
            link: emailLink
        }
        await sendEmail(existingUser.email, 'Password Reset Request', payload, "./emails/template/requestResetPassword.handlebars")

        res.status(200).json({
            success: true,
            message: `Hi ${existingUser.firstName}, an email has been sent to your email address with the password reset link`
        })
    }


})

const resetPassword = expressAsyncHandler(async (req, res) => {
    const { emailToken, userId, password, passwordConfirm } = req.body

    if (!password) {
        res.status(400)
        throw new Error('Password is required')
    }

    if (!passwordConfirm) {
        res.status(400)
        throw new Error('Password Confirm is required')
    }

    if (password !== passwordConfirm) {
        res.status(400)
        throw new Error('Password and Password Confirm must match')
    }

    if (password.length < 8) {
        res.status(400)
        throw new Error('Password must be at least 8 characters')
    }

    const passwordResetTokenUser = await VerifyResetToken.findOne({
        _userId: userId
    })
    if (!passwordResetTokenUser) {
        res.status(400)
        throw new Error('Invalid token or expired. Try resetting your password again')
    }

    const user = await User.findById({ _id: passwordResetTokenUser._userId }).select("-passwordConfirm")

    if (user && passwordResetTokenUser) {
        user.password = password
        await user.save()

        const payload = {
            name: user.firstName
        }
        await sendEmail(user.email, "Password Reset Success", payload, "./emails/template/resetPassword.handlebars")

        res.json({
            success: true,
            message: "Password reset successfully"
        })
    }
})

export { resetPasswordRequest, resetPassword }