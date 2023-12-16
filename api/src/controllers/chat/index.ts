import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';

export const sendMessage = catchAsync(async (req: ExpressRequest, res: Response, next) => {});
export const deleteMessage = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {});
