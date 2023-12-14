import { ISimpleUser } from './User';
import { IChatType } from './Chat';

export interface IRoomType {
    roomName: string;
    isGroupChat: boolean;
    _id: string;

    users: ISimpleUser[];
    roomImage?: string;
    roomAdmin?: string;
    blockedUsers: string[];
    lastMessage?: string;
}

export interface IActiveRoom extends IRoomType {
    messages: IChatType[];
}

export interface ISimpleRoom {
    roomName: string;
    isGroupChat: boolean;
    _id: string;
    users: string[];
    roomImage?: string;
    roomAdmin?: ISimpleUser;
    lastMessage?: string;
}
