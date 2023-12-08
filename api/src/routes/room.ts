import express, { NextFunction, Response } from 'express';
import { ExpressRequest } from '../Types/User';
import catchAsync from '../utils/catchAsync';
import createRoom from '../controllers/room/createRoom';
import searchRoom from '../controllers/room/searchRoom';
import { searchUsersForGroupChat } from '../controllers/user/searchUsers';
import { getRoom, getUserRooms } from '../controllers/room/getRooms';
import deleteRoom from '../controllers/room/deleteRoom';
import { updateGroupChat } from '../controllers/chat/groupChat';
import { addUserToGroupChat, giveAdminAccess } from '../controllers/room/groupChat';
import { blockUser } from '../controllers/user/userProfile';
import searchMessageOfRoom from '../controllers/room/searchMessageOfRoom';

const router = express.Router();

// ----------normal room (one to one chat)--------
// search room (user)
router.get('/search', searchRoom);
// room creation
router.post('/', createRoom);

// user search for groupchat
router.get('/usersearch', searchUsersForGroupChat);

// get all rooms for user
router.get('/', getUserRooms);
// get specific room
router.get('/:roomid', getRoom);

// room deletion
router.delete('/:roomid', deleteRoom);

// shared medias
router.get(
    '/:roomid/medias',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);
// shared files
router.get(
    '/:roomid/files',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);
// search message
router.get('/:roomid/message', searchMessageOfRoom);

// block user
router.put('/:roomid/block', blockUser);

// -----------groupChat room ----------------
// room update (name, image)
router.put('/:roomid/', updateGroupChat);

// add user by admin
router.post('/:roomid/user', addUserToGroupChat);

// add admin access
router.post('/:roomid/admin', giveAdminAccess);

const roomRouter = router;

export default roomRouter;
