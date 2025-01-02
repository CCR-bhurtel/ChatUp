import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";
import Room from "../../database/Model/Room";
import AppError from "../../lib/AppError";
import Chat from "../../database/Model/Chat";

const searchMessageOfRoom = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { roomid } = req.params;
    const { key } = req.query;
    const regExp = new RegExp(key as string, "i");
    const room = await Room.findById(roomid);
    if (!room) {
      return next(new AppError("Room not found", 400));
    }
    const messages = await Chat.find({
      textContent: regExp,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: "sender", select: "name profilePic" });

    return res.status(200).json({ messages });
  }
);

export default searchMessageOfRoom;
