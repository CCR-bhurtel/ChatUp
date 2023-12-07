import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import User from '../../database/Model/User';
import Room from '../../database/Model/Room';
import Chat from '../../database/Model/Chat';

const createRoom = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { users, isGroupChat } = req.body;
    if (isGroupChat) {
        const { groupName } = req.body;
        const groupChat = await Room.create({
            isGroupChat: true,
            roomName: groupName,
            users,
            roomAdmin: req.user._id,
        });
        const populatedGroupChat = await Room.findById(groupChat._id).populate({
            path: 'users',
            select: 'name profilePic',
        });

        return res.status(201).json({ message: 'Group created successfully', group: populatedGroupChat });
    } else {
        const existingRoom = await Room.findOne({
            users,
        }).populate({ path: 'users', select: 'name profilePic' });

        if (existingRoom) {
            const nextUser = existingRoom.users.find((user) => !user._id.equals(req.user._id));
            if (nextUser) {
                const populatedNextUser = await User.findById(nextUser._id);
                const chats = await Chat.find({ roomId: existingRoom._id })
                    .populate({
                        path: 'sender',
                        select: 'name profilePic _id',
                    })
                    .sort({ createdAt: -1 })

                    .limit(20);

                return res.status(200).json({
                    ...existingRoom.toJSON(),
                    chats,
                    roomName: populatedNextUser?.name,
                    roomImage: populatedNextUser?.profilePic,
                });
            }
        } else {
            const duoRoom = await Room.create({
                isGroupChat: false,
                users,
            });
            const nextUser = duoRoom?.users.find((user) => !user._id.equals(req.user._id));

            const populatedNextUser = await User.findById(nextUser);
            return res.status(200).json({
                ...duoRoom.toJSON(),
                chats: [],
                roomName: populatedNextUser?.name,
                roomImage: populatedNextUser?.profilePic,
            });
        }
    }
});

export default createRoom;
