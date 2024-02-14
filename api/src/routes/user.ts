/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: Autogenerated id for user
 *              email:
 *                  type: string
 *                  description: Unique email for user
 *              password:
 *                  type: string
 *                  description: self explanatory
 *              location:
 *                  type: string
 *                  description: Physical address of the user
 *              registerType:
 *                  type: string
 *                  description: defines how the user has signed up, 'emailPassword', 'google', 'facebook'
 *              contactNumber:
 *                  type: string
 *                  description: self explanatory
 *              preferences:
 *                  type: object
 *                  description: notification preferences of user
 *                  properties:
 *                      notification:
 *                          type: boolean
 *                      emails:
 *                          type: boolean
 *                      messages:
 *                          type: boolean
 *              blockedUsers:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: id of user that has been blocked by the user
 *
 */

/**
 * @swagger
 * /user:
 *  get:
 *      summary: Get logged in user's profile
 *      tags: [User]
 *      responses:
 *          200:
 *              description: user's profile information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          403:
 *              description: Access denied (Unauthorized)
 *          500:
 *              description: Server error
 
 */

/**
 * @swagger
 * /user/profile:
 *  put:
 *      summary: Update profile information
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: User's name
 *                contactNumber:
 *                   type: string
 *                   description: User's phone number
 *                location:
 *                  type: string
 *                  description: User's residential address
 *                preferences:
 *                  type: object
 *                  description: User's notification preferences
 *                  properties:
 *                    notification:
 *                      type: boolean
 *                      description: In-app notifications
 *                    emails:
 *                       type: boolean
 *                    messages:
 *                        type: boolean
 *                        description: contact messages
 *      responses:
 *          200:
 *              description: user's updated profile information
 *              content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 *  /user/profileimage:
 *    post:
 *      tags: [User]
 *      summary: Upload a profile pic
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                image:
 *                  type: string
 *                  format: binary
 *            encoding:
 *              image:
 *                contentType: 'image/png'
 *      responses:
 *        200:
 *          description: user with updated profile pic
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *
 */

import express from "express";
import upload from "../middlewares/imageUpload";
import {
  blockUser,
  profileImageUpload,
  unblockUser,
  userProfileUpdate,
} from "../controllers/user/userProfile";
import { changePreferences } from "../controllers/user/userSettings";
import getUserProfile from "../controllers/user/getUserProfile";

const router = express.Router();

router.get("/", getUserProfile);

router.post(
  "/profileimage",

  upload("userImages").single("image"),
  profileImageUpload
);

router.put("/profile", userProfileUpdate);

router.put("/block", blockUser);

router.put("/unblock", unblockUser);

router.put("/preferences", changePreferences);

const userRouter = router;

export default userRouter;
