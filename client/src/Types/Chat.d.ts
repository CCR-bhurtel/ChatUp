import { ISimpleUser } from './User';

export interface IChatType {
    _id: string;
    sender: ISimpleUser;
    messageType: 'Text' | 'File' | 'Media';
    textContent?: string;
    mediaId?: string;
    isDeleted: boolean;
    roomId?: string;
}
