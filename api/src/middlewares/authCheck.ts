import { NextFunction, Response } from 'express';
import parseToken from '../utils/parseToken';
import jwt from 'jsonwebtoken';
import User from '../database/Model/User';

const authCheck = async (req: any, res: Response, next: NextFunction) => {
    const authToken: string | null = parseToken(req);

    if (!authToken) {
        return res.status(403).json({ message: 'Error authenticating' });
    }
    if (authToken) {
        const decodedPayload: any = jwt.verify(authToken, process.env.JWT_SECRET as string);
        const user = await User.findById(decodedPayload.id);
        req.user = user;
        next();
    }
};

export default authCheck;
