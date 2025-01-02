import { NextFunction, Request, Response } from "express";
import catchAsync from "../../lib/catchAsync";
import Room from "../../database/Model/Room";
import AppError from "../../lib/AppError";
import Chat from "../../database/Model/Chat";

export const leaveRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const user = req.user;
    let room = await Room.findById(roomId);
    if (!room) {
      return next(new AppError("No room exists with given room id", 404));
    }
    if (room.roomAdmin.toString() === user?._id.toString()) {
      const { newAdminUserId } = req.body;
      if (!newAdminUserId)
        return next(new AppError("Please provide new admin", 400));
      await Room.findOneAndUpdate(
        { _id: room._id },
        {
          roomAdmin: newAdminUserId,
          $pull: {
            users: user?._id,
          },
        },
        { new: true }
      );
    } else {
      await Room.findOneAndUpdate(
        { _id: room._id },
        {
          $pull: {
            users: user?._id,
          },
        },
        {
          new: true,
        }
      );
    }
    const chat = await Chat.create({
      room: room?._id,
      messageType: "Info",
      textContent: `${user?.name} has left the room`,
    });
    room = await Room.findByIdAndUpdate(
      room?._id,
      {
        lastMessage: chat._id,
        lastMessageReadBy: [],
      },
      { new: true }
    )
      .populate({ path: "users", select: "name email location profilePic" })
      .populate({ path: "lastMessage" });
    const messages = await Chat.find({ room: room?._id })
      .populate({
        path: "sender",
      })
      .populate({ path: "media" });

    return res.status(200).json({ room, messages });
  }
);
