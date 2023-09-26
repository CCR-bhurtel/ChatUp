import { Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';

export const searchUsers = catchAsync(async (req: ExpressRequest, res: Response, next) => {});

export const createRoom = catchAsync(async (req: ExpressRequest, res: Response, next) => {});

export const sendMessage = catchAsync(async (req: ExpressRequest, res: Response, next) => {});



