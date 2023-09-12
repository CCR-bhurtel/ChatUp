import { NextFunction, Request, Response } from 'express';
import User from '../../database/Model/User';
import createSendToken from '../../utils/createSendToken';
import catchAsync from '../../utils/catchAsync';

const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, location, email, password } = req.body;
    const user = await User.create({
        name,
        location,
        email,
        password,
        registerType: 'emailPassword',
        blockedUsers: [],
    });
    createSendToken(user, res);
});

export default signup;
