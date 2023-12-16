import { Document, Model, Types } from 'mongoose';
import { PopulatedUser } from './User';

export interface IRoom extends Document {
    roomName: string;
    isGroupChat: boolean;

    users: Types.ObjectId[];
    roomImage?: string;
    roomAdmin?: IUser;
    blockedUsers: Types.ObjectId[];
    lastMessageDate: {
        type: Date;
    };
    lastMessage?: Types.ObjectId;
}

export interface IRoomMethods {}

export type RoomModel = Model<IRoom, {}, IRoomMethods>;

export interface PopulatedRoom extends IRoom {
    roomName: string;
    isGroupChat: boolean;
    _id: string;

    users: PopulatedUser[];
    roomImage?: string;
    roomAdmin?: IUser;
    blockedUsers: Types.ObjectId[];
    lastMessageDate: {
        type: Date;
    };
    lastMessage?: String;
}
