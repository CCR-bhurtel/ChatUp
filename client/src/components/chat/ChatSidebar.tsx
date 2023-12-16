import React from 'react';
import RoomList from './RoomList';
import SearchInput from '../reusables/SearchInput';

function ChatSidebar() {
    return (
        <div className="flex flex-col lg:ml-[120px] min-w-120 relative">
            <SearchInput onChange={(e) => {}} name="search" type="text" placeholder="Search users, groups" />
            <RoomList />
        </div>
    );
}

export default ChatSidebar;
