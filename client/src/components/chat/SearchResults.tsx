import React from 'react';
import Avatar from '../reusables/Avatar';
import Link from 'next/link';
import { useRoom } from '@/context/chat/RoomContextProvider';
import Loading from '../reusables/Loading';
import getAvatarImage from '@/utils/getAvatarImage';

import { IRoomType } from '@/Types/Room';
import { useRouter } from 'next/router';

import axios, { AxiosResponse } from 'axios';
import { useAuth } from '@/context/auth/AuthContextProvider';
import toast from 'react-hot-toast';

interface ISearchResult {
    results: IRoomType[];
    loading: boolean;
}
function SearchResult({ results, loading }: ISearchResult) {
    const router = useRouter();
    const auth = useAuth();

    const handleItemClick = async (id: string, isGroupChat: boolean) => {
        if (isGroupChat) {
            router.push(`/chat/${id}`);
        } else {
            try {
                const res: AxiosResponse<IRoomType> = await axios.post('/room', {
                    users: [id, auth.state.user?._id],
                    isGroupChat: false,
                });
                const room = res.data;
                router.push(`/chat/${room._id}`);
            } catch (err: any) {
                toast.error(err.response?.data.message || 'Error getting chats');
            }
        }
    };

    return (
        <div className="mt-8 mb-12 w-full h-full overflow-y-scroll no-scrollbar overflow-x-hidden">
            <div className="rooms  max-h-full flex gap-2 flex-col w-full md:pb-0">
                {loading ? (
                    <Loading />
                ) : !results.length ? (
                    <h2>No search results</h2>
                ) : (
                    results.map((room, i) => (
                        <div className="w-full h-full" key={room._id}>
                            <div
                                onClick={() => handleItemClick(room._id, room.isGroupChat)}
                                className="w-full h-full block"
                            >
                                <div className="cursor-pointer roomItem flex items-center justify-between flex-row p-2 m-2 bg-Gravel rounded-md">
                                    <div className="messageDetails flex flex-row gap-2 items-center">
                                        <Avatar
                                            source={
                                                room.isGroupChat
                                                    ? getAvatarImage(room.roomImage, true)
                                                    : getAvatarImage(room.roomImage, false)
                                            }
                                            className="h-[60px] w-[60px] "
                                        />
                                        <div className={`messageContent ${true ? 'text-gray-400' : 'text-white'}`}>
                                            <h2 className="text-md font-medium">{room.roomName}</h2>
                                            {room.isGroupChat ? (
                                                <p>
                                                    {room.lastMessage &&
                                                        `${
                                                            room.lastMessage?.sender?.name
                                                        } : ${room.lastMessage.textContent?.substring(0, 20)}`}
                                                </p>
                                            ) : (
                                                <p className="text-sm font-light"></p>
                                            )}
                                        </div>
                                    </div>
                                    {/* {room.sender.online ? (
                                    <div className="onlinestatus rounded-full w-2 h-2 bg-primary"></div>
                                ) : (
                                    ''
                                )} */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchResult;
