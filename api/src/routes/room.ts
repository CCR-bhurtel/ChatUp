import express, { NextFunction, Response } from 'express';
import { ExpressRequest } from '../Types/User';
import catchAsync from '../utils/catchAsync';
import createRoom from '../controllers/room/createRoom';
import searchRoom from '../controllers/room/searchRoom';

const router = express.Router();

// ----------normal room (one to one chat)--------
// search room (user)
router.get('/search', searchRoom);
// room creation
router.post('/', createRoom);
//657174f8d74dc6993a417571 65719b5d3c3afe9e83dfe8bb
// get all rooms
router.get(
    '/',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);
// get specific room
router.get(
    '/:roomid',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
        // const chats = await Chat.find({ roomId: groupChat._id }).populate({
        //     path: 'sender',
        //     select: 'name profilePic _id',
        // });
    })
);
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
