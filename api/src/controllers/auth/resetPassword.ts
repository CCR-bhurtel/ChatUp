import { NextFunction, Request, Response } from 'express';
import User from '../../database/Model/User';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/AppError';
import createSendToken from '../../utils/createSendToken';

const resetPasswordHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resetToken = req.params.token;
    const { newPassword } = req.body;
    const user = await User.findOne({
        resetToken,
        resetTokenExpires: {
            $gt: new Date(),
        },
    });

    if (!user) {
        return next(new AppError('Token invalid or already expired', 400));
    }

    user.password = newPassword;
    user.save();
    createSendToken(user, res);
});

export default resetPasswordHandler;
