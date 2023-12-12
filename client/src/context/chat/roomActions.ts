import { IRoomType } from '@/Types/Room';
import { IChatType } from '@/Types/Chat';

export enum AuthActionTypes {
    LoadRooms,
    EditRoomImage,
    SetCurrentRoom,
    RemoveRoom,
    AppendRoom,
    LeaveCurrentRoom,
    EditRoomName,
    EditRoomMembers,
}
