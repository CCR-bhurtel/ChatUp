
import passport from "passport";
import express, { NextFunction, Response } from "express";
import catchAsync from "../utils/catchAsync";
import createSendToken from "../utils/createSendToken";
import login from "../controllers/auth/login";
import signup from "../controllers/auth/signup";
import forgotPasswordHandler from "../controllers/auth/forgotPassword";
import changePasswordHandler from "../controllers/auth/changePassword";
import resetPasswordHandler from "../controllers/auth/resetPassword";
import authCheck from "../middlewares/authCheck";

const router = express.Router();

router.get(
  "/google",
  catchAsync(passport.authenticate("google", { scope: ["profile", "email"] }))
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email", "user_photos"],
  })
);

router.get("/googleredirect", passport.authenticate("google"), (req, res) => {
  if (req.user) createSendToken(req.user, res);
});

router.get(
  "/facebookredirect",
  passport.authenticate("facebook"),
  (req, res) => {
    if (req.user) createSendToken(req.user, res);
  }
);

router.post("/login", login);
router.post("/signup", signup);

router.post("/forgotpassword", forgotPasswordHandler);

router.post("/changepassword", authCheck, changePasswordHandler);
router.post("/resetpassword", resetPasswordHandler);

export default router;
