import React from 'react';
import RoomList from './RoomList';
import SearchInput from '../reusables/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMessage, faGear } from '@fortawesome/free-solid-svg-icons';
import AccountClickables from '../account/AccountClickables';
import { useRouter } from 'next/navigation';

interface IChatSidebar {
    handleGroupChatOpen: () => void;
}

function ChatSidebar({ handleGroupChatOpen }: IChatSidebar) {
    const router = useRouter();
    return (
        <div className="flex flex-row w-full h-full">
            <div className="flex-col h-[60%] hidden lg:flex justify-between self-end p-2">
                <div className="flex w-full justify-between lg:flex-col lg:w-auto lg:items-center lg:h-auto lg:gap-6">
                    <div className="cursor-pointer">
                        <FontAwesomeIcon onClick={handleGroupChatOpen} icon={faPencil} style={{ color: 'white', height: '20px', width: '20px' }} />
                    </div>
                    <div className="cursor-pointer" onClick={() => router.push('/chat')}>
                        <FontAwesomeIcon icon={faMessage} style={{ color: '#4044ED' }} />
                    </div>
                    <div className="cursor-pointer">
                        <FontAwesomeIcon icon={faGear} style={{ color: 'white' }} />
                    </div>
                </div>
                <AccountClickables />
            </div>

            <div className="flex flex-col w-full h-full relative flex-1 p-4 lg:p-1">
                <SearchInput onChange={(e) => {}} name="search" type="text" placeholder="Search users, groups" />
                <RoomList />
            </div>
        </div>
    );
}

export default ChatSidebar;
