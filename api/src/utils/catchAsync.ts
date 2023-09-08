import { NextFunction, Request, Response } from 'express';

module.exports = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err: any) => next(err));
    };
};
