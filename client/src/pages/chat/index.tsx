import ChatFooter from '@/components/chat/ChatFooter';
import ChatSidebar from '@/components/chat/ChatSidebar';
import CreateGroupChat from '@/components/chat/CreateGroupChat';
import Popup from '@/components/layouts/Popup';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function Chat() {
    const [createGroupOpen, setCreateGroupOpen] = useState(false);

    const handleCreateGroupOpen = () => {
        setCreateGroupOpen(true);
    };

    const handleCreateGroupClose = () => {
        setCreateGroupOpen(false);
    };

    const handleFormSubmit = () => {};

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
        <div className="chatContainer  p-4  flex justify-center">
            {createGroupOpen && (
                <Popup onClose={handleCreateGroupClose}>
                    <CreateGroupChat onSubmit={handleFormSubmit} />
                </Popup>
            )}
            <div className="min-w-[100%] lg:min-w-[25%] min-h-100">
                <ChatSidebar />
            </div>
            <div className="emptyChatArea hidden lg:flex lg:min-w-[75%] items-center justify-center ">
                Empty chat area
            </div>
            <ChatFooter handleGroupChatOpen={handleCreateGroupOpen} />
        </div>
    );
}

export default Chat;
