import { IChatType } from "@/Types/Chat";
import { RoomActionTypes, RoomActions } from "./roomActions";
import { RoomStateInterface } from "./RoomContextProvider";

// | LoadActiveRoomPreviousMessages;

function getUniqueObjects(arr: IChatType[]) {
  const uniqueMap: any = {};
  return arr.filter((obj) => {
    const id = obj._id;
    if (!uniqueMap[id]) {
      uniqueMap[id] = true;
      return true;
    }
    return false;
  });
}

const roomReducer = (
  state: RoomStateInterface,
  action: RoomActions
): RoomStateInterface => {
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
      return {
        ...state,
        isActiveRoomLoading: false,
        activeRoom: action.payload,
      };

    case RoomActionTypes.ErrorLoadingActiveRoom:
      return { ...state, isActiveRoomLoading: false, activeRoom: undefined };

    case RoomActionTypes.EditRoomImage:
      if (!state.activeRoom) {
        return state;
      }
      return {
        ...state,
        activeRoom: { ...state.activeRoom, roomImage: action.payload },
      };

    case RoomActionTypes.EditRoom:
    case RoomActionTypes.EditRoomMembers:
      if (!state.activeRoom) {
        return state;
      }
      return { ...state, activeRoom: action.payload };

    case RoomActionTypes.RemoveRoom:
      const newRoomList = state.rooms.filter(
        (room) => room._id !== action.payload
      );
      return { ...state, rooms: newRoomList };

    case RoomActionTypes.AppendRoom:
      const newRooms = state.rooms;

      newRooms.unshift(action.payload);
      return { ...state, rooms: Array.from(new Set(newRooms)) };

    case RoomActionTypes.AppendChatToRoom:
      if (!state.activeRoom) return state;
      if (action.payload.room !== state.activeRoom._id) return state;

      let newMessageList = state.activeRoom.messages;
      newMessageList?.push(action.payload);
      newMessageList = getUniqueObjects(newMessageList);

      return {
        ...state,
        activeRoom: { ...state.activeRoom, messages: newMessageList },
      };

    case RoomActionTypes.LoadActiveRoomPreviousMessages:
      if (!state.activeRoom) return state;
      const refreshedMessages = action.payload.concat(
        state.activeRoom.messages
      );
      return {
        ...state,
        activeRoom: { ...state.activeRoom, messages: refreshedMessages },
      };
    case RoomActionTypes.AppendRooms:
      const newRoomListAfterAppend = state.rooms.concat(action.payload);
      return { ...state, rooms: Array.from(new Set(newRoomListAfterAppend)) };

    case RoomActionTypes.LeaveActiveRoom:
      const newRoomListAfterLeave = state.rooms.filter(
        (room) => room._id !== state.activeRoom?._id
      );
      return { ...state, activeRoom: undefined, rooms: newRoomListAfterLeave };

    case RoomActionTypes.RemoveChatFromRoom:
      if (!state.activeRoom) return state;
      const newMessageListAfterDeletion = state.activeRoom.messages.filter(
        (room) => room._id !== action.payload
      );

      return {
        ...state,
        activeRoom: {
          ...state.activeRoom,
          messages: newMessageListAfterDeletion,
        },
      };

    case RoomActionTypes.UpdateLastMessage:
      const message = action.payload;
      let newRoomListAfterLastMessageUpdate = state.rooms.map((room) => {
        if (message.room != room._id) return room;
        let users = [message.sender._id];
        if (message.room === state.activeRoom?._id)
          users = state.activeRoom.users.map((user) => user._id);
        return {
          ...room,
          lastMessage: message,

          lastMessageReadBy: users,
          lastMessageDate: new Date(),
        };
      });

      newRoomListAfterLastMessageUpdate.sort((a, b) => {
        return (
          new Date(b.lastMessageDate).getTime() -
          new Date(a.lastMessageDate).getTime()
        );
      });

      return { ...state, rooms: newRoomListAfterLastMessageUpdate };

    case RoomActionTypes.UpdateLastMessageReadUsers:
      const { roomId, userId } = action.payload;
      if (!userId || !roomId) return state;
      const newRoomListAfterReadUpdate = state.rooms.map((room) => {
        if (roomId !== room._id) return room;
        if (room.lastMessageReadBy.includes(userId)) return room;
        return {
          ...room,
          lastMessageReadBy: [...room.lastMessageReadBy, userId],
        };
      });
      return { ...state, rooms: newRoomListAfterReadUpdate };

    default:
      return state;
  }
};

export default roomReducer;
