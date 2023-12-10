import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import User from '../../database/Model/User';

const getUserProfile = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id)
        .select('-password -resetToken -passwordChangedAt -resetTokenExpires -googleId -facebookId')
        .populate({ path: 'blockedUsers', select: 'name profilePic' });

    return res.status(200).json(user);
});

export default getUserProfile;
