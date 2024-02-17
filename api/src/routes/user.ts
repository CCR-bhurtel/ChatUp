

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
