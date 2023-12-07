import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import User from '../../database/Model/User';
import Room from '../../database/Model/Room';

const searchRoom = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
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
});

export default searchRoom;
