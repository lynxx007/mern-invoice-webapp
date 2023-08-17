import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmails.js";
import 'dotenv/config.js'


const domainUrl = process.env.DOMAIN
const { randomBytes } = await import('crypto')

const resendEmailVerificationToken = expressAsyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!email) {
        res.status(400)
        throw new Error('Please provide an email')
    }

    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }

    if (user.isEmailVerified) {
        res.status(400)
        throw new Error('This user has already been verified')
    }

    let verificationToken = await VerifyResetToken.findOne({ _userId: user._id })

    if (verificationToken) {
        await verificationToken.deleteOne()
    }

    const resentToken = randomBytes(32).toString('hex')

    let emailToken = await new VerifyResetToken({
        _userId: user._id,
        token: resentToken
    }).save()

    const emailLink = `${domainUrl}/api/v1/auth/verify/${emailToken.token}/${user._id}`

    const payload = {
        name: user.firstName,
        link: emailLink
    }

    await sendEmail(user.email, 'Account Verification', payload, './emails/template/accountVerification.handlebars')

    res.json({
        success: true,
        message: `${user.firstName}, an email has been sent to your account, please verify within 15 minutes.`
    })
})

export default resendEmailVerificationToken

