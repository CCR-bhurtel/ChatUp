import { ISimpleRoom } from '@/Types/Room';
import { userData, usersData } from './testUser';

export const privateRoom: ISimpleRoom = {
    _id: 'fdasf12342345',
    roomName: 'Alex Doe',
    roomImage:
        'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBvdHJhaXR8ZW58MHx8MHx8fDA%3D',
    isGroupChat: false,
    users: [userData, usersData[0]],
};

export const groupChatRoom: ISimpleRoom = {
    _id: 'fdasflk234dfa',
    roomName: 'Heh',
    roomImage:
        'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fHww',
    isGroupChat: true,
    users: usersData,
    roomAdmin: usersData[0],
};
