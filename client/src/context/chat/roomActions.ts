import { IActiveRoom, IRoomType } from '@/Types/Room';
import { IChatType } from '@/Types/Chat';

export enum RoomActionTypes {
    RoomsLoading,
    LoadRooms,
    EditRoomImage,
    ActiveRoomLoading,
    SetActiveRoom,
    RemoveRoom,
    ErrorLoadingRooms,
    ErrorLoadingActiveRoom,
    AppendRoom,
    AppendRooms,
    LeaveActiveRoom,
    EditRoom,
    EditRoomMembers,
    AppendChatToRoom,
    RemoveChatFromRoom,
    LoadActiveRoomPreviousMessages,
    UpdateLastMessage,
    UpdateLastMessageReadUsers,
}

export interface RoomsLoading {
    type: RoomActionTypes.RoomsLoading;
}
export interface LoadRooms {
    type: RoomActionTypes.LoadRooms;
    payload: IRoomType[];
}

export interface EditRoomImage {
    type: RoomActionTypes.EditRoomImage;
    payload: string;
}

export interface ActiveRoomLoading {
    type: RoomActionTypes.ActiveRoomLoading;
}
export interface SetActiveRoom {
    type: RoomActionTypes.SetActiveRoom;
    payload: IActiveRoom;
}

export interface ErrorLoadingActiveRoom {
    type: RoomActionTypes.ErrorLoadingActiveRoom;
}

export interface RemoveRoom {
    type: RoomActionTypes.RemoveRoom;
    payload: string;
}

export interface AppendRoom {
    type: RoomActionTypes.AppendRoom;
    payload: IRoomType;
}

export interface AppendRooms {
    type: RoomActionTypes.AppendRooms;
    payload: IRoomType[];
}

export interface LeaveActiveRoom {
    type: RoomActionTypes.LeaveActiveRoom;
}

export interface EditRoom {
    type: RoomActionTypes.EditRoom;
    payload: IActiveRoom;
}

export interface EditRoomMembers {
    type: RoomActionTypes.EditRoomMembers;
    payload: IActiveRoom;
}

export interface AppendChatToRoom {
    type: RoomActionTypes.AppendChatToRoom;
    payload: IChatType;
}

export interface RemoveChatFromRoom {
    type: RoomActionTypes.RemoveChatFromRoom;
    payload: string;
}

export interface LoadActiveRoomPreviousMessages {
    type: RoomActionTypes.LoadActiveRoomPreviousMessages;
    payload: IChatType[];
}

export interface ErrorLoadingRooms {
    type: RoomActionTypes.ErrorLoadingRooms;
}

export interface UpdateLastMessage {
    type: RoomActionTypes.UpdateLastMessage;
    payload: IChatType;
}

export interface UpdateLastMessageReadUsers {
    type: RoomActionTypes.UpdateLastMessageReadUsers;
    payload: {
        roomId?: string;
        userId?: string;
    };
}

export type RoomActions =
    | RoomsLoading
    | LoadRooms
    | ErrorLoadingRooms
    | EditRoomImage
    | ActiveRoomLoading
    | SetActiveRoom
    | ErrorLoadingActiveRoom
    | RemoveRoom
    | AppendRoom
    | AppendRooms
    | LeaveActiveRoom
    | EditRoom
    | EditRoomMembers
    | AppendChatToRoom
    | LoadActiveRoomPreviousMessages
    | RemoveChatFromRoom
    | UpdateLastMessage
    | UpdateLastMessageReadUsers;
