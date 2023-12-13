import { Model, Types } from 'mongoose';
import { ISimpleUser, IUserType } from './User';
import { IChatType } from './Chat';

export interface IRoom {
    roomName: string;
    isGroupChat: boolean;

    users: [Types.ObjectId];
    roomImage?: string;
    roomAdmin: {
        type: Types.ObjectId;
        ref: 'User';
    };
    blockedUsers: [Types.ObjectId];
    lastMessage: {
        type: Date;
    };
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
    lastMessage: {
        type: Date;
    };
}

export interface IRoomType {
    roomName: string;
    isGroupChat: boolean;
    _id: string;

    users: IUserType[];
    roomImage?: string;
    roomAdmin?: IUserType;
    blockedUsers: IUserType[];
    lastMessage: Date;
}

export interface IActiveRoom extends IRoomType {
    messages: IChatType[];
}

export interface ISimpleRoom {
    roomName: string;
    isGroupChat: boolean;
    _id: string;
    users: ISimpleUser[];
    roomImage?: string;
    roomAdmin?: ISimpleUser;
}
