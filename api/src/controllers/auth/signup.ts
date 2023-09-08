import { NextFunction, Request, Response } from 'express';
import User from '../../database/Model/User';
import createSendToken from '../../utils/createSendToken';

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.create({ ...req.body });
        createSendToken(user, res);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

export default signup;
