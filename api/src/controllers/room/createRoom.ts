import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../Types/User';
import catchAsync from '../../utils/catchAsync';
import User from '../../database/Model/User';
import Room from '../../database/Model/Room';
import Chat from '../../database/Model/Chat';
import AppError from '../../utils/AppError';
import { formatRoomDetail } from '../../utils/formatRoomDetails';

const createRoom = catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { users, isGroupChat } = req.body;
    if (isGroupChat) {
        const { groupName } = req.body;
        if (!groupName) return next(new AppError('Please enter group name', 400));
        const groupChat = await Room.create({
            isGroupChat: true,
            roomName: groupName,
            users: [...users, req.user._id],
            roomAdmin: req.user._id,
        });
        const populatedGroupChat = await Room.findById(groupChat._id).populate({
            path: 'users',
            select: 'name profilePic',
        });

        return res.status(201).json({ message: 'Group created successfully', group: populatedGroupChat });
    } else {
        if (req.user.blockedUsers.includes(req.body.users[0])) return next(new AppError('This user is blocked', 400));

        const existingRoom = await Room.findOne({
            users: req.body.users,
        }).populate({ path: 'users', select: 'name profilePic' });

        if (existingRoom) {
            const formattedRoom = await formatRoomDetail(existingRoom, req.user._id);

            // const chats = await Chat.find({ roomId: existingRoom._id })
            //     .populate({
            //         path: 'sender',
            //         select: 'name profilePic',
            //     })
            //     .sort({ createdAt: -1 })

            //     .limit(20);

            return res.status(200).json({
                ...formattedRoom.toJSON(),
            });
        } else {
            const duoRoom = await Room.create({
                isGroupChat: false,
                users,
            });
            const formattedRoom = await formatRoomDetail(duoRoom, req.user._id);

            return res.status(200).json({
                ...formattedRoom.toJSON(),
            });
        }
    }
});

export default createRoom;
