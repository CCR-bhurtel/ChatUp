import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';
import createSendToken from '../../utils/createSendToken';
import User from '../../database/Model/User';

interface loginType {
    email: string;
    password: string;
    confirmPassword: string;
}
const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: loginType = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please fill in all the fields' });
    const user = await User.findOne({ email }).select(['+password']);
    if (!user) {
        return next(new AppError('No user found with given email, please signup', 400));
    }

    if (await user.checkPassword(password)) createSendToken(user, res);
    else {
        return next(new AppError('Incorrect credentials', 400));
    }
});

export default login;
