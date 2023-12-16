import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ExpressRequest } from '../../Types/User';
import AppError from '../../utils/AppError';
import Room from '../../database/Model/Room';
import fs from 'fs';
import path from 'path';

const changeRoomImage = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (!req.file) return next(new AppError('Image was not provided', 400));
    const { roomId } = req.params;
    if (!roomId) return next(new AppError('No room Id', 400));

    const existingRoom = await Room.findById(roomId).populate({ path: 'roomAdmin', select: 'name' });

    if (!existingRoom) return next(new AppError('No room found with given id', 400));

    if (existingRoom.isGroupChat && existingRoom.roomAdmin?._id.toString() !== req.user._id.toString())
        return next(new AppError('You are not authorized to change image', 403));

    const updatedRoom = await Room.findByIdAndUpdate(roomId, { roomImage: req.file.filename }, { new: true });

    try {
        if (existingRoom.roomImage && !existingRoom.roomImage?.startsWith('default'))
            await fs.unlinkSync(path.join(__dirname, '../../../public/images/groupImages', existingRoom.roomImage));
    } catch (err) {
        console.log(err);
    }

    return res.status(200).json(updatedRoom);
});

export default changeRoomImage;
