import express, { NextFunction, Response } from 'express';
import { ExpressRequest } from '../Types/User';
import catchAsync from '../utils/catchAsync';
import createRoom from '../controllers/room/createRoom';
import searchRoom from '../controllers/room/searchRoom';
import { searchUsersForGroupChat } from '../controllers/user/searchUsers';
import { getRoom, getUserRooms } from '../controllers/room/getRooms';

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
router.delete(
    '/:roomid',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);


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
router.get(
    '/:roomid/message',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);

// block user
router.put(
    '/:roomid/block',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);

// -----------groupChat room ----------------
// room update (name, image)
router.put(
    '/:roomid/',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);

// add user by admin
router.post(
    '/:roomid/user',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);

// add admin access
router.post(
    '/:roomid/admin',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);

router.get('/', (req, res) => {
    return res.send('Hello world from chat router');
});

const roomRouter = router;

export default roomRouter;
