import { Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import User from '../../database/Model/User';

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
