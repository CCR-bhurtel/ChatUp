import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import Room from '../../database/Model/Room';
import Chat from '../../database/Model/Chat';
import AppError from '../../utils/AppError';

export const getUserRooms = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const rooms = await Room.find({
        users: userId,
    }).limit(limit as number);

    return res.status(200).json({ rooms });
});

export const getRoom = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const roomId = req.params.roomid;

    const room = await Room.findById(roomId);
    if (room) {
        const chats = await Chat.find({ roomId: room._id }).populate({ path: 'sender', select: 'name profilePic' });

        return res.status(200).json({ room, chats });
    } else {
        return next(new AppError('Room not found', 404));
    }
});
