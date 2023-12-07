import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import User from '../../database/Model/User';
import Room from '../../database/Model/Room';
import AppError from '../../utils/AppError';

export const searchUsersForGroupChat = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { key = '' } = req.query;
    const { selectedUsers = [], roomId } = req.body;

    const regex = new RegExp(key as string, 'i');

    const room = await Room.findById(roomId);
    if (!room) return next(new AppError('Room not found with given id', 404));
    const users = await User.find({
        name: regex,
        _id: { $nin: selectedUsers.concat(room.blockedUsers) },
    });

    return res.status(200).json({ users });
});
