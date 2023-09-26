import { NextFunction, Response } from 'express';
import parseToken from '../utils/parseToken';
import jwt from 'jsonwebtoken';
import User from '../database/Model/User';
import { JWT_SECRET } from '../config/keys';
import { PopulatedUser } from '../Types/User';

const authCheck = async (req: any, res: Response, next: NextFunction) => {
    const authToken: string | null = parseToken(req);

    if (!authToken) {
        return res.status(403).json({ message: 'Error authenticating' });
    }
    if (authToken) {
        try {
            const decodedPayload: any = jwt.verify(authToken, JWT_SECRET);
            const user = await User.findById(decodedPayload.id).select(['-password']);

            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    }
};

export default authCheck;
