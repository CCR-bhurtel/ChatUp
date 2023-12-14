import { Types } from 'mongoose';
import { IRoom } from '../Types/Room';
import User from '../database/Model/User';

// for private room's name and image

export const formatPrivateRoomDetail = async (room: IRoom, userId: Types.ObjectId): Promise<IRoom> => {
    const nextUserId = room.users.find((user) => user._id !== userId);
    if (!nextUserId) return room;
    const nextUser = await User.findById(nextUserId).select('name profilePic');
    if (!nextUser) return room;
    room.roomImage = nextUser.profilePic;
    room.roomName = nextUser.name;
    return room;
};
