import { Model, Types } from 'mongoose';
import { IUser, ReferenceType } from './User';
import { IRoom, PopulatedRoom } from './Room';

export interface IChat {
    sender: ReferenceType;
    messageType: 'Text' | 'File' | 'Media';
    textContent?: String;
    mediaId?: Types.ObjectId;
    isDeleted: false;
    room?: Types.ObjectId;
    verified: Booolean;
    read: Boolean;
}

export interface IPopulatedChat extends IChat {
    sender: IUser;
    room: PopulatedRoom;
}

export type ChatModel = Model<IChat, {}, {}>;
