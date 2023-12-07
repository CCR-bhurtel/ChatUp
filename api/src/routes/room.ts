import express, { NextFunction, Response } from 'express';
import { ExpressRequest, IUser, PopulatedUser, UserModel } from '../Types/User';
import catchAsync from '../utils/catchAsync';
import Room from '../database/Model/Room';
import User from '../database/Model/User';
import { IRoom, RoomModel } from '../Types/Room';
import mongoose from 'mongoose';

const router = express.Router();

// ----------normal room (one to one chat)--------
// search room (user)
router.get(
    '/search',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
        const { key } = req.query;
        const regexPattern = new RegExp(key as string, 'i');
        // search from rooms that he is involved, other users
        const users = await User.find({
            name: regexPattern,
            _id: {
                $nin: req.user.blockedUsers,
                $not: { $eq: req.user._id },
            },
        });
        const involvedGroupChats = await Room.find({ name: regexPattern, isGroupChat: true, users: req.user._id });
        let searchResults = [];
        searchResults.push(...users);
        searchResults.push(...involvedGroupChats);
        return res.status(200).json({ searchResult: searchResults });
    })
);
// room creation
router.get(
    '/create',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);
// get all rooms
router.get(
    '/',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
);
// get specific room
router.get(
    '/:roomid',
    catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {})
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
