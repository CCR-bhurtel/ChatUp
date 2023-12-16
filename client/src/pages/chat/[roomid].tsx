import { IChatType } from '@/Types/Chat';
import { IActiveRoom, IRoomType } from '@/Types/Room';
import ChatArea from '@/components/chat/ChatArea';
import RoomInfo from '@/components/chat/RoomInfo';
import Popup from '@/components/layouts/Popup';
import Loading from '@/components/reusables/Loading';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { useRoom } from '@/context/chat/RoomContextProvider';
import { RoomActionTypes } from '@/context/chat/roomActions';
import { getSocket, initSocket } from '@/utils/socketService';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

function ChatRoom() {
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
    const router = useRouter();
    const { state, dispatch } = useRoom();

    const auth = useAuth();

    const [socketConnected, setSocketConnected] = useState(false);

    const handleOpenInfo = () => {
        setIsInfoOpen(true);
    };
    const handleCloseInfo = () => {
        setIsInfoOpen(false);
    };

    const socket = useMemo(() => getSocket(), []);

    const handleRoomLoad = async () => {
        const { roomid } = router.query;
        if (!roomid) return;
        dispatch({ type: RoomActionTypes.ActiveRoomLoading });
        try {
            const res: AxiosResponse<{ roomDetails: IRoomType; messages: IChatType[] }> = await axios.get(
                `/room/${roomid}`
            );
            const room: IActiveRoom = { ...res.data.roomDetails, messages: res.data.messages };
            console.log(room);
            dispatch({ type: RoomActionTypes.SetActiveRoom, payload: room });
            socket.emit('joinRoom', room._id);
        } catch (err) {
            toast.error('Error loding room');
            router.push('/chat');
        }
    };

    useEffect(() => {
        try {
            if (!socket) initSocket();

            if (auth.state.user) {
                socket.emit('initialSetup', auth.state.user);
            }
            socket.on('connected', () => setSocketConnected(true));
        } catch (err) {
            console.log(err);
        }
    }, [auth.state.user]);

    useEffect(() => {
        handleRoomLoad();
        const background = document.querySelector('.backgroundlayer');
        if (background) {
            background.classList.toggle('hidden');
        }

        return () => {
            if (background) {
                background.classList.toggle('hidden');
            }
        };
    }, []);
    return (
        <div
            className={`pt-4 w-full md:w-auto flex flex-col self-end h-[93vh]  overflow-hidden   ${
                !isInfoOpen && 'relative'
            }`}
        >
            {state.isActiveRoomLoading ? (
                <Loading />
            ) : !state.activeRoom ? (
                <p></p>
            ) : (
                <>
                    <div className="popup md:hidden">
                        {isInfoOpen ? (
                            <Popup onClose={handleCloseInfo}>
                                <RoomInfo light={true} room={state.activeRoom} />
                            </Popup>
                        ) : (
                            ''
                        )}
                    </div>
                    <ChatArea room={state.activeRoom} handleInfoOpen={handleOpenInfo} />
                </>
            )}
        </div>
    );
}

export default ChatRoom;
