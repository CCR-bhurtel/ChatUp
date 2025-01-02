import { NextFunction, Response } from "express";
import catchAsync from "../../lib/catchAsync";
import { ExpressRequest } from "../../Types/User";
import Room from "../../database/Model/Room";
import AppError from "../../lib/AppError";
import Chat from "../../database/Model/Chat";
import Media from "../../database/Model/Media";
import { IChat, IPopulatedChat } from "../../Types/Chat";

const sendImageMessage = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { message, roomId } = req.body;
    if (!roomId) {
      return next(new AppError("Please provide room id", 400));
    }
    const room = await Room.findById(roomId, { users: userId });

    if (!room) {
      return next(new AppError("No room with provided room id", 404));
    }

    const chats: (IChat | IPopulatedChat)[] = [];

    if (message) {
      const messageChat = await Chat.create({
        messageType: "Text",
        textContent: message,
        sender: userId,
        room: room?._id,
      });
      chats.push(messageChat);
    }

    if (req.files) {
      const files = req.files as Array<any>;
      const filePromises = files.map(async (file) => {
        const media = await Media.create({
          roomId: room?._id,
          type: "ImgVideo",
          name: file.filename,
          downloadUrl: file.filename,
        });

        let imageChat = await Chat.create({
          messageType: "File",
          textContent: message,
          sender: userId,
          room: room?._id,
          media: media._id,
        });
        let populatedImageChat = await Chat.findById(imageChat._id).populate({
          path: "media",
        });

        if (populatedImageChat) chats.push(populatedImageChat);
      });
      await Promise.all(filePromises);
    }

    if (chats.length) {
      const lastChat = chats[chats.length - 1];

      await Room.findByIdAndUpdate(room?._id, {
        lastMessage: lastChat._id,
        lastMessageDate: new Date(),
        lastMessageReadBy: [userId],
      });
    }

    return res.status(200).json(chats);
  }
);

export default sendImageMessage;
