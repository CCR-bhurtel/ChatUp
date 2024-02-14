/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  required:
 *                      - email
 *                      - password
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: john@gmail.com
 *                          password:
 *                              type: string
 *                              exmple: john@123
 *      responses:
 *          404:
 *              description: User not available
 *          400:
 *              description: Wrong credentials
 *          200:
 *              description: Login success
 *              content:
 *                  application/json:
 *                      schema:
 *                          allOf:
 *                              - $ref: '#/components/schemas/User'
 *                              - type: object
 *                                properties:
 *                                  token:
 *                                      type: string
 *          500:
 *              description: Server error
 * /auth/signup:
 *  post:
 *      summary: Register new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  required:
 *                      - name
 *                      - email
 *                      - password
 *                      - confirmPassword
 *                  schema:
 *                      properties:
 *                          name:
 *                              required: true
 *                              type: string
 *                              example: John Doe
 *                          email:
 *                              type: string
 *                              example: john@gmail.com
 *                          password:
 *                              type: string
 *                              example: helloworld
 *                          confirmPassword:
 *                              type: string
 *                              example: helloworld
 *      responses:
 *          400:
 *              description: invalid data provided
 *          200:
 *              description: User registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          500:
 *              description: server error
 * /auth/forgotPassword:
 *  post:
 *      tags: [Auth]
 *      summary: user forgot password (send reset email)
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: john@gmail.com
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Email sent successfully
 *          404:
 *              description: User with provided email not found
 *          400:
 *              description: Email not provided
 *          500:
 *              description: Server error
 * /auth/changepassword:
 *  post:
 *      tags: [Auth]
 *      summary: change password (if old password is known)
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          oldPassword:
 *                              type: string
 *                          newPassword:
 *                              type: string
 *                          newPasswordConfirm:
 *                              type: string
 *      responses:
 *          200:
 *              description: password change success
 *          403:
 *              description: not authorized, login first
 *          401:
 *              description: old password is incorrect
 *          400:
 *              description: both password doesn't match
 *          500:
 *              description: server error
 * /auth/resetpassword:
 *  post:
 *      tags: [Auth]
 *      parameters:
 *          - in: query
 *            name: token
 *            type: string
 *            required: true
 *            description: token from email
 *      requestbody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          password:
 *                              type: string
 *                          confirmPassword:
 *                              type: string
 *      responses:
 *          400:
 *              description: Token invalid or password didn't matcch
 *          500:
 *              description: server error
 *          200:
 *              description: password successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          allOf:
 *                              - $ref: '#/components/schemas/User'
 *
 *
 */

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
