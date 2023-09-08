import { Model, Types } from 'mongoose';

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
}

export interface IRoomMethods {}

export type RoomModel = Model<IRoom, {}, IRoomMethods>;

export interface PopulatedRoom {}
