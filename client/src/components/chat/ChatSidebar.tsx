import React from 'react';
import RoomList from './RoomList';
import SearchInput from '../reusables/SearchInput';

function ChatSidebar() {
    return (
        <div className="flex flex-col min-w-100">
            <SearchInput onChange={(e) => {}} name="search" type="text" placeholder="Search Chats" />
            <RoomList />
        </div>
    );
}

export default ChatSidebar;
