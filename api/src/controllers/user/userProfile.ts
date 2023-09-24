import { Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import User from '../../database/Model/User';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';

export const profileImageUpload = catchAsync(async (req: ExpressRequest, res, next) => {
    const fileName = req.file?.filename;

    if (fileName) {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                profilePic: fileName,
            },
            { new: true }
        );
        return res.status(200).json(user);
    } else {
        return next(new AppError("Couldn't save image", 400));
    }
});

export const userProfileUpdate = catchAsync(async (req: ExpressRequest, res: Response, next) => {
    const { name, location, contactNumber } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { name, location, contactNumber }, { new: true });

    return res.status(200).json({ user });
});

export const blockUser = catchAsync(async (req: ExpressRequest, res: Response, next) => {
    const { userid } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                blockedUsers: userid,
            },
        },
        { new: true }
    );

    return res.status(200).json(user);
});

export const unblockUser = catchAsync(async (req: ExpressRequest, res: Response, next) => {
    const { userid } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                blockedUsers: userid,
            },
        },
        { new: true }
    );

    return res.status(200).json(user);
});

export const changePreferences = catchAsync(async (req: ExpressRequest, res: Response, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            preferences: req.body,
        },
        { new: true }
    );

    return res.status(200).json(user);
});
