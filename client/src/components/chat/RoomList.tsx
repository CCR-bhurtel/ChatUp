import React, { useState } from 'react';
import Avatar from '../reusables/Avatar';
import Link from 'next/link';

function ChatList() {
    const [rooms, setRooms] = useState([
        {
            _id: 'djflasj12342',
            isGroupChat: false,
            sender: {
                profilePic:
                    'https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                name: 'Elizabeth II',
                online: true,
            },
            lastmessage: '1 unread message',
            read: false,
        },
        {
            _id: 'djflasj12343',
            isGroupChat: false,

            sender: {
                profilePic:
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D',
                name: 'John Doe',
                online: true,
            },
            lastmessage: '1 unread message',
            read: false,
        },

        {
            _id: 'djflasj12344',
            isGroupChat: false,

            sender: {
                profilePic:
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D',
                name: 'John Doe',
                online: true,
            },
            lastmessage: '1 unread message',
            read: false,
        },
        {
            _id: 'djflasj12345',
            isGroupChat: false,

            sender: {
                profilePic:
                    'https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                name: 'Elizabeth II',
                online: false,
            },
            lastmessage: 'That was an awesome ....',
            read: true,
        },
        {
            _id: 'djflasj12346',
            isGroupChat: false,

            sender: {
                name: 'Nick',
                profilePic:
                    'https://images.unsplash.com/photo-1552234994-66ba234fd567?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D',
                online: true,
            },
            lastmessage: 'Hello there, I need to talk to you.....',
            read: true,
        },
        {
            _id: 'djflasj12347',
            isGroupChat: false,

            sender: {
                profilePic:
                    'https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                name: 'Elizabeth II',
                online: true,
            },
            lastmessage: 'Hello there, I need to talk to you.....',
            read: true,
        },
    ]);
    return (
        <div className="mt-8 w-full  overflow-scroll">
            <div className="rooms max-h-[70vh] flex gap-2 flex-col w-full  md:pb-0">
                {rooms.map((room, i) => (
                    <Link href={`/chat/${room._id}`} key={room._id}>
                        <div className="cursor-pointer roomItem flex items-center justify-between flex-row relative w-full p-4 bg-Gravel rounded-md">
                            <div className="messageDetails flex flex-row gap-2 items-center ">
                                <Avatar source={room.sender.profilePic} className="h-[60px] w-[60px] " />
                                <div className={`messageContent ${room.read ? 'text-gray-400' : 'text-white'}`}>
                                    <h2 className="text-md font-medium">{room.sender.name}</h2>
                                    <p className="text-sm font-light">{room.lastmessage}</p>
                                </div>
                            </div>
                            {room.sender.online ? (
                                <div className="onlinestatus rounded-full w-2 h-2 bg-primary"></div>
                            ) : (
                                ''
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ChatList;
