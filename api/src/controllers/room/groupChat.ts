import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";

export const updateGroupChat = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {}
);

export const addUserToGroupChat = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {}
);

export const giveAdminAccess = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {}
);
