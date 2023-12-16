import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ExpressRequest } from '../../Types/User';
import AppError from '../../utils/AppError';
import Room from '../../database/Model/Room';
import fs from 'fs';
import path from 'path';

const changeRoomImage = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (!req.file) return next(new AppError('Image wass not provided', 400));
    const roomId = req.params;
    if (!roomId) return next(new AppError('No room Id', 400));

    const existingRoom = await Room.findById(roomId);
    if (!existingRoom) return next(new AppError('No room found with given id', 400));

    const updatedRoom = await Room.findByIdAndUpdate(roomId, { roomImage: req.file.filename });

    if (existingRoom.roomImage && !existingRoom.roomImage?.startsWith('default'))
        await fs.unlinkSync(path.join(__dirname, '../../../public/images/groupImages', existingRoom.roomImage));

    return res.status(200).json(updatedRoom);
});

export default changeRoomImage;
