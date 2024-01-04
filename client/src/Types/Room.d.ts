import { ISimpleUser } from './User';
import { IChatType } from './Chat';

export interface IRoomType {
    roomName: string;
    isGroupChat: boolean;
    _id: string;

    users: ISimpleUser[];
    roomImage: string;
    roomAdmin?: string;
    blockedUsers: string[];
    lastMessage?: IChatType;
    lastMessageReadBy: string[];
    lastMessageDate: Date;
}

export interface IActiveRoom extends IRoomType {
    messages: IChatType[];
}

export interface ISimpleRoom extends IRoomType {
    users: string[];
}
