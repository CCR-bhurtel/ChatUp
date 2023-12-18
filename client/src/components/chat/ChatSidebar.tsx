import React, { ChangeEvent, useState } from 'react';
import RoomList from './RoomList';
import SearchInput from '../reusables/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMessage, faGear } from '@fortawesome/free-solid-svg-icons';
import AccountClickables from '../account/AccountClickables';
import { useRouter } from 'next/navigation';
import { IRoomType } from '@/Types/Room';
import SearchResult from './SearchResults';
import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

interface IChatSidebar {
    handleGroupChatOpen: () => void;
}

function ChatSidebar({ handleGroupChatOpen }: IChatSidebar) {
    const router = useRouter();

    const [searchKey, setSearchKey] = useState('');

    const [searchResultLoading, setSearchResultLoading] = useState<boolean>(false);

    const [searchResult, setSearchResult] = useState<IRoomType[]>([]);

    const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value);
        if (e.target.value && e.target.value.length) {
            try {
                const res: AxiosResponse<{ searchResult: IRoomType[] }> = await axios.get(
                    `/room/search?key=${e.target.value}`
                );
                const result = res.data.searchResult;
                setSearchResult(result);
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className="flex flex-row w-full h-full ">
            <div className="flex-col h-[60%] hidden lg:flex justify-between self-end px-2 py-4">
                <div className="flex w-full justify-between lg:flex-col lg:w-auto lg:items-center lg:h-auto lg:gap-6">
                    <div className="cursor-pointer">
                        <FontAwesomeIcon
                            onClick={handleGroupChatOpen}
                            icon={faPencil}
                            style={{ color: 'white', height: '20px', width: '20px' }}
                        />
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

            <div className="flex flex-col w-full h-full relative flex-1 p-4 lg:p-1 no-scrollbar overflow-auto">
                <SearchInput
                    onChange={handleSearchChange}
                    value={searchKey}
                    name="search"
                    type="text"
                    placeholder="Search users, groups"
                />
                {searchKey.length ? (
                    <SearchResult results={searchResult} loading={searchResultLoading} />
                ) : (
                    <RoomList />
                )}
            </div>
        </div>
    );
}

export default ChatSidebar;
