import { IChatType } from '@/Types/Chat';
import { IActiveRoom, IRoomType } from '@/Types/Room';
import React, { Dispatch, ReactElement, createContext, useContext } from 'react';
import { RoomActionTypes, RoomActions } from './roomActions';
import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

export interface RoomStateInterface {
    activeRoom?: IActiveRoom;
    activeRoomMessages?: IChatType[];
    isRoomsLoading: boolean;
    isActiveRoomLoading: boolean;
    isPreviousMessagesLoading: boolean;
    rooms: IRoomType[];
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

const loadRooms = async (dispatch: Dispatch<RoomActions>) => {
    try {
        const response: AxiosResponse<IRoomType[]> = await axios.get(`/room`, { withCredentials: true });
        dispatch({ type: RoomActionTypes.LoadRooms, payload: response.data });
    } catch (err: any) {
        dispatch({ type: RoomActionTypes.ErrorLoadingRooms });
        toast.error(err?.response?.data.message || 'Error loading rooms');
    }
};

function RoomContextProvider(props: { children: ReactElement }) {
    return <div>RoomContextProvider</div>;
}

export default RoomContextProvider;
