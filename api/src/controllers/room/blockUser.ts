import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";
import Room from "../../database/Model/Room";
import AppError from "../../lib/AppError";
import User from "../../database/Model/User";

const blockUserFromGroupChat = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {}
);

export const blockUser = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { roomid } = req.params;
    const room = await Room.findById(roomid);
    if (!room) return next(new AppError("Room not found", 400));
    if (room.isGroupChat) {
      return blockUserFromGroupChat(req, res, next);
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        blockedUsers: {
          $push: req.body.userid,
        },
      });
    }
  }
);
