import { IActiveRoom } from '@/Types/Room';
import ChatArea from '@/components/chat/ChatArea';
import RoomInfo from '@/components/chat/RoomInfo';
import Popup from '@/components/layouts/Popup';
import { groupChatRoom } from '@/data/testRoom';

import React, { useEffect, useState } from 'react';

function ChatRoom() {
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
    const handleOpenInfo = () => {
        setIsInfoOpen(true);
    };
    const handleCloseInfo = () => {
        setIsInfoOpen(false);
    };
    const [room, setRoom] = useState<IActiveRoom | undefined>(groupChatRoom);
    useEffect(() => {
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
            className={`pt-4 w-full md:w-auto flex flex-col self-end h-[93vh] overflow-hidden   ${
                !isInfoOpen && 'relative'
            }`}
        >
            <div className="popup md:hidden">
                {isInfoOpen ? (
                    <Popup onClose={handleCloseInfo}>
                        <RoomInfo light={true} room={room} />
                    </Popup>
                ) : (
                    ''
                )}
            </div>
            <ChatArea handleInfoOpen={handleOpenInfo} />
        </div>
    );
}

export default ChatRoom;
