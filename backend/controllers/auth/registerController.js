import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmails.js";
import 'dotenv/config.js'


const domainUrl = process.env.DOMAIN

const { randomBytes } = await import('crypto')


const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, username, firstName, lastName, password, passwordConfirm } = req.body

    if (!email) {
        res.status(400)
        throw new Error('Email is required')
    }

    if (!username) {
        res.status(400)
        throw new Error('Username is required')
    }

    if (!firstName || !lastName) {
        res.status(400)
        throw new Error('First name and last name are required')
    }

    if (!password) {
        res.status(400)
        throw new Error('Password is required')
    }

    if (!passwordConfirm) {
        res.status(400)
        throw new Error('Password confirmation is required')
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('The email address you have entered is already associated with another account')
    }

    const newUser = new User({
        email,
        username,
        firstName,
        lastName,
        password,
        passwordConfirm
    })

    const registeredUser = await newUser.save()

    if (!registeredUser) {
        res.status(400)
        throw new Error('Something went wrong')
    }

    if (registeredUser) {
        const verificationToken = randomBytes(32).toString('hex')

        let emailVerificationToken = await new VerifyResetToken({
            _userId: registeredUser._id,
            token: verificationToken
        }).save()

        const emailLink = `${domainUrl}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`

        const payload = {
            name: registeredUser.firstName,
            link: emailLink
        }

        await sendEmail(registeredUser.email, "Account Verification", payload, "./emails/template/accountVerification.handlebars")

        res.json({
            success: true,
            message: `A new user ${registeredUser.firstName} has been registered! A verification email has been sent to your account. Please verify within 15 minutes`
        })
    }


})

export default registerUser