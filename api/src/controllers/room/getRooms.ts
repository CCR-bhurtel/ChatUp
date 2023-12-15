import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import Room from '../../database/Model/Room';
import Chat from '../../database/Model/Chat';
import AppError from '../../utils/AppError';
import { formatRoomDetail } from '../../utils/formatRoomDetails';

export const getUserRooms = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    let { page = 0, limit = 10 } = req.query;

    let totalSkipItems: number = parseInt(page as string) * parseInt(limit as string);
    const rooms = await Room.find({
        users: userId,
    })
        .sort({ lastMessageDate: -1 })
        .skip(totalSkipItems)
        .limit(limit as number);

    let formattedRooms = rooms.map(async (room) => {
        const formattedRoom = await formatRoomDetail(room, req.user._id);
        return formattedRoom;
    });
    let resolvedFormattedRooms = Promise.all(formattedRooms);
    return res.status(200).json({ rooms: resolvedFormattedRooms });
});

export const getRoom = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const roomId = req.params.roomid;

    const room = await Room.findById(roomId);
    if (!room) return next(new AppError("Room can't be found, please check roomId", 400));
    const formatttedRoom = await formatRoomDetail(room, req.user._id);
    if (room) {
        const chats = await Chat.find({ roomId: room._id }).populate({ path: 'sender', select: 'name profilePic' });

        return res.status(200).json({ room: formatttedRoom, chats });
    } else {
        return next(new AppError('Room not found', 404));
    }
});
