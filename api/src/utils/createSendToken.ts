import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { PopulatedUser } from '../Types/User';

const createSendToken = (user: PopulatedUser, res: Response) => {
    try {
        const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: process.env.JWT_EXPIRES_IN as string,
        });
        const time: number = parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string);
        const cookieOptions = {
            expires: new Date(Date.now() + time * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.httpOnly = true;

        res.cookie('Authorization', token, cookieOptions);
        return res.status(200).json({ ...user, token });
    } catch (err) {
        return res.status(400).json(err);
    }
};

export default createSendToken;
