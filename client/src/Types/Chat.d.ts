import { ISimpleUser } from './User';

export interface IChatType {
    _id: string;
    sender: ISimpleUser;
    messageType: 'Text' | 'File' | 'Media';
    textContent?: String;
    mediaId?: String;
    isDeleted: Boolean;
    roomId?: String;
    verified: Booolean;
}
