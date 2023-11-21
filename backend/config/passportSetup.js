import "dotenv/config";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/userModel.js";

const domain = process.env.DOMAIN;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;

/**
 * Configures passport authentication using the Google OAuth 2.0 strategy.
 * Handles the authentication process and creates a new user if they don't exist in the database.
 */
export const googleAuth = () => {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${domain}/api/v1${googleCallbackURL}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        // Remove when in production
        console.log(profile);

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            const name = profile.displayName.split(" ");
            const newUser = {
              username: profile._json.given_name,
              firstName: name[0],
              lastName: name[1],
              avatar: profile._json.picture,
              email: profile._json.email,
              googleId: profile.id,
              isEmailVerified: profile._json.email_verified,
              provider: "google",
            };

            user = await User.create(newUser);
          }

          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
