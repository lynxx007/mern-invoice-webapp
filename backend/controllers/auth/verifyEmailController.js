import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmails.js";
import 'dotenv/config.js'


const domainUrl = process.env.DOMAIN;


const verifyUserEmail = expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId }).select("-passwordConfirm")

    if (!user) {
        res.status(400);
        throw new Error("User not found for this token");
    }

    if (user.isEmailVerified) {
        res.status(400).send("This user has already been verified. Please login.")
    }


    const userToken = await VerifyResetToken.findOne({
        _userId: user._id,
        token: req.params.emailToken
    })

    if (!userToken) {
        res.status(400)
        throw new Error("Invalid token")
    }

    user.isEmailVerified = true;
    await user.save()

    if (user.isEmailVerified) {
        const emailLink = `${domainUrl}/login`

        const payload = {
            name: user.firstName,
            link: emailLink
        }

        await sendEmail(
            user.email,
            "Welcome - Account Verified",
            payload,
            './emails/template/welcome.handlebars'
        )

        res.redirect('/auth/verify')
    }


})

export default verifyUserEmail