import express, { NextFunction, Response } from "express";
import { ExpressRequest } from "../Types/User";
import catchAsync from "../lib/catchAsync";
import createRoom from "../controllers/room/createRoom";
import searchRoom from "../controllers/room/searchRoom";
import { searchUsersForGroupChat } from "../controllers/user/searchUsers";
import { getRoom, getUserRooms } from "../controllers/room/getRooms";
import deleteRoom from "../controllers/room/deleteRoom";
// import { updateGroupChat } from '../controllers/chat/groupChat';
import {
  addUserToGroupChat,
  giveAdminAccess,
} from "../controllers/room/groupChat";
import { blockUser } from "../controllers/user/userProfile";
import searchMessageOfRoom from "../controllers/room/searchMessageOfRoom";
import upload from "../middlewares/imageUpload";
import changeRoomImage from "../controllers/room/changeRoomImage";
import { readLastMessage } from "../controllers/room/readLastMessage";
import getMediasForRoom from "../controllers/room/getMedias";
import { leaveRoom } from "../controllers/room/leaveRoom";

const router = express.Router();

// ----------normal room (one to one chat)--------
// search room (user)
router.get("/search", searchRoom);
// room creation
router.post("/", createRoom);

// user search for groupchat
router.post("/usersearch", searchUsersForGroupChat);

// get all rooms for user
router.get("/", getUserRooms);
// get specific room
router.get("/:roomid", getRoom);

// room deletion
router.delete("/:roomid", deleteRoom);

// shared medias
router.post("/:roomid/medias", getMediasForRoom);
// shared files
router.get(
  "/:roomid/files",
  catchAsync(
    async (req: ExpressRequest, res: Response, next: NextFunction) => {}
  )
);
// search message
router.get("/:roomid/message", searchMessageOfRoom);

// block user
router.put("/:roomid/block", blockUser);

router.put("/:roomId/lastmessage", readLastMessage);

// -----------groupChat room ----------------
// room update
// router.put('/:roomid/', updateGroupChat);

// room update (image)
router.put(
  "/image/:roomId",
  upload("groupImages").single("image"),
  changeRoomImage
);

router.post("/group/:roomId/leave", leaveRoom);

// add user by admin
router.post("/:roomid/user", addUserToGroupChat);

// add admin access
router.post("/:roomid/admin", giveAdminAccess);

const roomRouter = router;

export default roomRouter;
