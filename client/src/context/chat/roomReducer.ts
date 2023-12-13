import { IRoomType } from '@/Types/Room';
import { RoomActionTypes, RoomActions } from './roomActions';
import { RoomStateInterface } from './RoomContextProvider';

// | LoadActiveRoomPreviousMessages;

const roomReducer = (state: RoomStateInterface, action: RoomActions): RoomStateInterface => {
    switch (action.type) {
        case RoomActionTypes.RoomsLoading:
            return { ...state, isRoomsLoading: true };
        case RoomActionTypes.LoadRooms:
            return { ...state, isRoomsLoading: false, rooms: action.payload };
        case RoomActionTypes.ErrorLoadingRooms:
            return { ...state, isRoomsLoading: false, rooms: [] };

        case RoomActionTypes.ActiveRoomLoading:
            return { ...state, isActiveRoomLoading: true };

        case RoomActionTypes.SetActiveRoom:
            return { ...state, isActiveRoomLoading: false, activeRoom: action.payload };

        case RoomActionTypes.ErrorLoadingActiveRoom:
            return { ...state, isActiveRoomLoading: false, activeRoom: undefined };

        case RoomActionTypes.EditRoomImage:
            if (!state.activeRoom) {
                return state;
            }
            return { ...state, activeRoom: { ...state.activeRoom, roomImage: action.payload } };

        case RoomActionTypes.EditRoom:
        case RoomActionTypes.EditRoomMembers:
            if (!state.activeRoom) {
                return state;
            }
            return { ...state, activeRoom: action.payload };

        case RoomActionTypes.RemoveRoom:
            const newRoomList = state.rooms.filter((room) => room._id !== action.payload);
            return { ...state, rooms: newRoomList };

        case RoomActionTypes.AppendRoom:
            const rooms = state.rooms;
            rooms.unshift(action.payload);
            return { ...state, rooms };

        case RoomActionTypes.AppendChatToRoom:
            if (!state.activeRoom) return state;
            const newMessageList = state.activeRoom.messages;
            newMessageList?.push(action.payload);
            return { ...state, activeRoom: { ...state.activeRoom, messages: newMessageList } };

        case RoomActionTypes.LoadActiveRoomPreviousMessages:
            if (!state.activeRoom) return state;
            const refreshedMessages = action.payload.concat(state.activeRoom.messages);
            return { ...state, activeRoom: { ...state.activeRoom, messages: refreshedMessages } };
        case RoomActionTypes.AppendRooms:
            const newRoomListAfterAppend = state.rooms.concat(action.payload);
            return { ...state, rooms: newRoomListAfterAppend };

        case RoomActionTypes.LeaveActiveRoom:
            return { ...state, activeRoom: undefined };

        case RoomActionTypes.RemoveChatFromRoom:
            if (!state.activeRoom) return state;
            const newMessageListAfterDeletion = state.activeRoom.messages.filter((room) => room._id !== action.payload);

            return { ...state, activeRoom: { ...state.activeRoom, messages: newMessageListAfterDeletion } };

        default:
            return state;
    }
};

export default roomReducer;
