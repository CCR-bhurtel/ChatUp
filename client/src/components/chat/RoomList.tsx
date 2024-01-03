import React, { useEffect, useMemo } from 'react';
import Avatar from '../reusables/Avatar';
import Link from 'next/link';
import { useRoom } from '@/context/chat/RoomContextProvider';
import Loading from '../reusables/Loading';
import getAvatarImage from '@/utils/getAvatarImage';
import { getSocket } from '@/utils/socketService';
import { IChatType } from '@/Types/Chat';
import { RoomActionTypes } from '@/context/chat/roomActions';
import { useAuth } from '@/context/auth/AuthContextProvider';

function ChatList() {
    const { state, dispatch } = useRoom();
    const auth = useAuth();
    const { activeUsers } = auth.state;
    const userId = useMemo(() => auth.state.user?._id, [auth]);

    useEffect(() => {
        const socket = getSocket();
        socket.on('messageReceived', (message: IChatType) => {
            dispatch({ type: RoomActionTypes.UpdateLastMessage, payload: message });
        });
    }, []);

    return (
        <div className="mt-8 mb-20 w-full h-full overflow-y-scroll no-scrollbar overflow-x-hidden">
            <div className="rooms max-h-full flex gap-2 flex-col w-full md:pb-0">
                {state.isRoomsLoading ? (
                    <Loading />
                ) : !state.rooms ? (
                    <h2>Rooms not available</h2>
                ) : (
                    state.rooms?.map((room, i) => {
                        const textColor =
                            userId && room.lastMessageReadBy.includes(userId) ? 'text-gray-400' : 'text-white';
                        const otherUsers = room.users.filter((userId) => userId !== auth.state.user?._id);

                        const isActive = otherUsers.some((userId) => activeUsers.includes(userId));
                        console.log(otherUsers, activeUsers, isActive);

                        return (
                            <div className="w-full h-full" key={room._id}>
                                <Link href={`/chat/${room._id}`} className="w-full h-full block">
                                    <div
                                        className={`cursor-pointer roomItem flex items-center justify-between flex-row p-2 m-2
                                        ${room._id === state.activeRoom?._id ? 'bg-sapphire' : 'bg-Gravel'}
                                         rounded-md`}
                                    >
                                        <div className="messageDetails flex flex-row gap-2 items-center">
                                            <Avatar
                                                source={
                                                    room.isGroupChat
                                                        ? getAvatarImage(room.roomImage, true)
                                                        : getAvatarImage(room.roomImage, false)
                                                }
                                                className="h-[60px] w-[60px] "
                                            />
                                            <div className={`messageContent`}>
                                                <h2 className="text-md font-medium text-white">{room.roomName}</h2>
                                                {room.isGroupChat ? (
                                                    <p className={`${textColor}`}>
                                                        {room.lastMessage &&
                                                            `${
                                                                room.lastMessage?.sender?.name
                                                            } : ${room.lastMessage.textContent?.substring(0, 20)}`}
                                                    </p>
                                                ) : (
                                                    <p className={`text-sm font-light ${textColor}`}>
                                                        {room.lastMessage ? room.lastMessage?.textContent : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {isActive ? (
                                            <div className="onlinestatus rounded-full w-2 h-2 bg-primary"></div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ChatList;
