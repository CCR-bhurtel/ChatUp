import { IRoomType } from '@/Types/Room';
import ChatFooter from '@/components/chat/ChatFooter';
import ChatSidebar from '@/components/chat/ChatSidebar';
import CreateGroupChat from '@/components/chat/CreateGroupChat';
import Popup from '@/components/layouts/Popup';
import { loadRooms, useRoom } from '@/context/chat/RoomContextProvider';
import { RoomActionTypes } from '@/context/chat/roomActions';
import { getSocket } from '@/utils/socketService';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Chat() {
    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const { dispatch } = useRoom();

    const handleCreateGroupOpen = () => {
        setCreateGroupOpen(true);
    };

    const handleCreateGroupClose = () => {
        setCreateGroupOpen(false);
    };

    const handleFormSubmit = async (userIds: string[], groupName: string) => {
        if (!groupName) {
            toast.error('Please enter valid room name');
            return;
        } else if (userIds.length < 1) {
            toast.error('Please enter any other member');
            return;
        }
        try {
            const res: AxiosResponse<{ message: string; group: IRoomType }> = await axios.post(`/room`, {
                isGroupChat: true,
                groupName: groupName,
                users: userIds,
            });
            dispatch({ type: RoomActionTypes.AppendRoom, payload: res.data.group });
            toast.success(res.data.message);

            handleCreateGroupClose();
        } catch (err: any) {
            toast.error(err.response?.data.message || 'Error creating group');
        }
    };

    useEffect(() => {
        dispatch({ type: RoomActionTypes.ErrorLoadingActiveRoom });
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

    useEffect(() => {
        let socket = getSocket();

        socket.on('newRoomCreated', (room: IRoomType) => {
            dispatch({ type: RoomActionTypes.AppendRoom, payload: room });
        });
    }, []);

    useEffect(() => {
        loadRooms(dispatch);
    }, [dispatch]);

    return (
        <div className="chatContainer h-[90%] w-full flex lg:flex-row justify-start flex-col">
            {createGroupOpen && (
                <Popup onClose={handleCreateGroupClose}>
                    <CreateGroupChat onSubmit={handleFormSubmit} />
                </Popup>
            )}
            <div className="w-full lg:w-[30%] flex-1 min-h-100 items-start overflow-y-scroll no-scrollbar">
                <ChatSidebar handleGroupChatOpen={handleCreateGroupOpen} />
            </div>
            <div className="emptyChatArea hidden lg:flex lg:flex-1 lg:h-full items-center justify-center text-white text-center">
                Start Chatting now by clicking on the pencil <br /> icon or an existing group chat
            </div>
            <ChatFooter handleGroupChatOpen={handleCreateGroupOpen} />
        </div>
    );
}

export default Chat;
