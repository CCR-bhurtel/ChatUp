import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';

const blockUserFromGroupChat = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {});

const blockUser = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {});
