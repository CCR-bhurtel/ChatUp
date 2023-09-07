import { Model, Types } from 'mongoose';
import { ReferenceType } from './User';

export interface IChat {
    sender: ReferenceType;
    messageType: 'Text' | 'File';
    mediaId?: Types.ObjectId;
    isDeleted: false;
}

export type ChatModel = Model<IChat, {}, {}>;
