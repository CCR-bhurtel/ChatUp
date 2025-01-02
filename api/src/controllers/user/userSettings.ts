import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";
import User from "../../database/Model/User";
import crypto from "crypto";
export const changePreferences = catchAsync(
  async (req: ExpressRequest, res: Response, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        preferences: { ...req.user.preferences, ...req.body },
      },
      { new: true }
    );

    return res.status(200).json(user);
  }
);

export const deleteAccountRequest = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    const deleteToken = crypto.randomBytes(12).toString("hex");
  }
);
