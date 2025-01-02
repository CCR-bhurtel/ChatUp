import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../Types/User";
import catchAsync from "../../lib/catchAsync";
import User from "../../database/Model/User";
import Room from "../../database/Model/Room";

const searchRoom = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { key } = req.query;
    const regexPattern = new RegExp(key as string, "i");

    // TODO:- search after populate
    const users = await User.find({
      name: regexPattern,
      _id: {
        $nin: req.user.blockedUsers,
        $not: { $eq: req.user._id },
      },
    });

    const formattedUsersToRoom = users.map((user) => ({
      _id: user._id,
      isGroupChat: false,
      roomImage: user.profilePic,
      roomName: user.name,
    }));

    const involvedGroupChats = await Room.find({
      roomName: regexPattern,
      isGroupChat: true,
      users: req.user._id,
    }).populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name profilepic" },
    });

    let searchResults = [];
    searchResults.push(...formattedUsersToRoom);
    searchResults.push(...involvedGroupChats);
    return res.status(200).json({ searchResult: searchResults });
  }
);

export default searchRoom;
