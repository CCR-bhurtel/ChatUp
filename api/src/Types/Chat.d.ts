import { Model, Types } from 'mongoose';
import { ReferenceType } from './User';

export interface IChat {
    sender: ReferenceType;
    messageType: 'Text' | 'File' | 'Media';
    textContent?: String;
    mediaId?: Types.ObjectId;
    isDeleted: false;
    roomId?: Types.ObjectId;
    verified: Booolean;
    read: Boolean;
}

export type ChatModel = Model<IChat, {}, {}>;
