import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import Room from '../../database/Model/Room';
import AppError from '../../utils/AppError';
export const readLastMessage = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId: string = req.body.userId;
    const roomId = req.params.roomId;
    if (!userId || !roomId) return next(new AppError('cannot read message', 400));
    await Room.findOneAndUpdate({ _id: roomId }, { $addToSet: { lastMessageReadBy: userId } });
    return res.status(200).json({ message: 'Message read successfuly' });
});
