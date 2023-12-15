import { Document, Model, Types } from 'mongoose';
import { PopulatedUser } from './User';

export interface IRoom extends Document {
    roomName: string;
    isGroupChat: boolean;

    users: Types.ObjectId[];
    roomImage?: string;
    roomAdmin?: {
        type: Types.ObjectId;
        ref: 'User';
    };
    blockedUsers: Types.ObjectId[];
    lastMessageDate: {
        type: Date;
    };
    lastMessage?: String;
}

export interface IRoomMethods {}

export type RoomModel = Model<IRoom, {}, IRoomMethods>;

export interface PopulatedRoom {
    roomName: string;
    isGroupChat: boolean;
    _id: string;

    users: [PopulatedUser];
    roomImage?: string;
    roomAdmin?: {
        type: Types.ObjectId;
        ref: 'User';
    };
    blockedUsers: [Types.ObjectId];
    lastMessageDate: {
        type: Date;
    };
    lastMessage?: String;
}
