import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";
import Room from "../../database/Model/Room";
import AppError from "../../lib/AppError";
import Chat from "../../database/Model/Chat";

export const deleteChatsOfRoom = async (id: string) => {
  try {
    await Chat.deleteMany({
      roomId: id,
    });
  } catch (err) {
    return err;
  }
};

const deleteRoom = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { roomid } = req.params;

    if (!roomid) {
      return next(new AppError("Room id not found", 400));
    }

    const userId = req.user._id;

    const room = await Room.findOne({
      _id: roomid,
      users: userId,
    });

    if (!room) {
      return next(new AppError("Cannot delete room, permission denied", 403));
    }

    await Room.findByIdAndDelete(roomid);
    deleteChatsOfRoom(room._id.toString());

    return res.status(200).json({ message: "Room deleted successfully" });
  }
);

export default deleteRoom;
