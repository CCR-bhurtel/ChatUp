import { IChatType } from '@/Types/Chat';
import { IActiveRoom, IRoomType, ISimpleRoom } from '@/Types/Room';
import React, { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';
import { RoomActionTypes, RoomActions } from './roomActions';
import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import roomReducer from './roomReducer';

export interface RoomStateInterface {
    activeRoom?: IActiveRoom;
    activeRoomMessages?: IChatType[];
    isRoomsLoading: boolean;
    isActiveRoomLoading: boolean;
    isPreviousMessagesLoading: boolean;
    rooms: ISimpleRoom[];
}

const INITIAL_STATE: RoomStateInterface = {
    activeRoom: undefined,
    activeRoomMessages: [],
    isRoomsLoading: false,
    isActiveRoomLoading: false,
    isPreviousMessagesLoading: false,
    rooms: [],
};

export const RoomContext = createContext<{
    state: RoomStateInterface;
    dispatch: Dispatch<RoomActions>;
}>({
    state: INITIAL_STATE,
    dispatch: () => undefined,
});

export const useRoom = () => useContext(RoomContext);

export const loadRooms = async (dispatch: Dispatch<RoomActions>) => {
    try {
        const response: AxiosResponse<{ rooms: ISimpleRoom[] }> = await axios.get(`/room`, { withCredentials: true });
        dispatch({ type: RoomActionTypes.LoadRooms, payload: response.data.rooms });
    } catch (err: any) {
        dispatch({ type: RoomActionTypes.ErrorLoadingRooms });
        toast.error(err?.response?.data.message || 'Error loading rooms');
    }
};

function RoomContextProvider(props: { children: ReactElement }) {
    const [state, dispatch] = useReducer(roomReducer, INITIAL_STATE);

    return <RoomContext.Provider value={{ state, dispatch }}>{props.children}</RoomContext.Provider>;
}

export default RoomContextProvider;
