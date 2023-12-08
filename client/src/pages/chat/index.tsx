import ChatSidebar from '@/components/chat/ChatSidebar';
import React, { useEffect } from 'react';

function Chat() {
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
        <div className="chatContainer p-4  flex justify-center">
            <div className="min-w-[100%] md:min-w-[20%] min-h-100">
                <ChatSidebar />
            </div>
            <div className="emptyChatArea hidden md:flex md:min-w-[80%] items-center justify-center ">
                Empty chat area
            </div>
        </div>
    );
}

export default Chat;
