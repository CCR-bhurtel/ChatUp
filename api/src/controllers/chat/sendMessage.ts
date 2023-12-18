import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ExpressRequest } from '../../Types/User';
import Room from '../../database/Model/Room';
import AppError from '../../utils/AppError';
import Chat from '../../database/Model/Chat';

const sendMessage = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const { message, roomId } = req.body;

    if (!message || message.length < 1) return next(new AppError('Message length less than', 400));

    const room = await Room.findById(roomId, { users: userId });

    if (!room) return next(new AppError('Cannot send message to the room', 401));

    const chat = await Chat.create({
        sender: userId,
        messageType: 'Text',
        textContent: message,
        room: room._id,
    });

    await Room.findByIdAndUpdate(room._id, { lastMessage: chat._id, lastMessageDate: new Date() });

    return res.status(201).json(chat);
});

export default sendMessage;
