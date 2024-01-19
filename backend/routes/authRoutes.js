import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyUserEmail from "../controllers/auth/verifyEmailController.js";
import loginUser from "../controllers/auth/loginController.js";
import { loginLimiter } from "../middleware/apiLimiter.js";
import newAccessToken from "../controllers/auth/refreshTokenController.js";
import resendEmailVerificationToken from "../controllers/auth/resendVerifyEmailController.js";
import {
  resetPassword,
  resetPasswordRequest,
} from "../controllers/auth/passwordResetController.js";
import logoutUser from "../controllers/auth/logoutController.js";
import passport from "passport";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const router = express.Router();

router.post("/login", loginLimiter, loginUser);

router.get("/new_access_token", newAccessToken);

router.post("/register", registerUser);

router.get("/verify/:emailToken/:userId", verifyUserEmail);

router.post("/resend_email_token", resendEmailVerificationToken);

router.post("/reset_password_request", resetPasswordRequest);

router.post("/reset_password", resetPassword);

router.post("/logout", logoutUser);

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const existingUser = await User.findById(req.user.id);
    jwt.sign(
      {
        id: req.user.id,
        roles: existingUser.roles,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        provider: existingUser.provider,
        avatar: existingUser.avatar,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "20m",
      },
      (err, token) => {
        const embedJWT = `
        <html>
        <script>
        window.localStorage.setItem("googleToken","${token}")
        window.location.href='/dashboard'
        </script>
        </html>
        `;
        res.send(embedJWT);
      }
    );
  }
);

export default router;
