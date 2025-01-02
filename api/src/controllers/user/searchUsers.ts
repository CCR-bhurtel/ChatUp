import { NextFunction, Response } from "express";
import { ExpressRequest, IUser } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";
import User from "../../database/Model/User";
import Room from "../../database/Model/Room";
import AppError from "../../lib/AppError";
import { Types } from "mongoose";

export const searchUsersForGroupChat = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { key = "" } = req.query;
    const { selectedUsers = [], roomId } = req.body;

    const regex = new RegExp(key as string, "i");

    const exlcludedMembers: Types.ObjectId[] = [...selectedUsers, req.user._id];

    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) return next(new AppError("Room not found with given id", 404));
      exlcludedMembers.concat(room.blockedUsers);
    }

    const users = await User.find({
      name: regex,
      _id: { $nin: exlcludedMembers },
    }).limit(5);

    return res.status(200).json({ users });
  }
);
