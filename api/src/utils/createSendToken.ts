import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { PopulatedUser } from '../Types/User';
import { JWT_COOKIE_EXPIRES_IN, JWT_SECRET } from '../config/keys';

const createSendToken = (user: PopulatedUser, res: Response) => {
    try {
        const token: string = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_COOKIE_EXPIRES_IN,
        });
        const time: number = parseInt(JWT_COOKIE_EXPIRES_IN);
        const cookieOptions = {
            expires: new Date(Date.now() + time * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.httpOnly = true;

        res.cookie('Authorization', token, cookieOptions);
        return res.status(200).json({ ...user._doc, token });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

export default createSendToken;
