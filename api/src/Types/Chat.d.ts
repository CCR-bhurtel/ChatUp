import { Model, Types } from 'mongoose';
import { ReferenceType } from './User';

export interface IChat {
    sender: ReferenceType;
    messageType: 'Text' | 'File' | 'Media';
    mediaId?: Types.ObjectId;
    isDeleted: false;
    roomId?: Types.ObjectId;
}



export type ChatModel = Model<IChat, {}, {}>;
