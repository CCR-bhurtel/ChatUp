import {
    faPhone,
    faTrashCan,
    faVideoCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SyntheticEvent, createRef, useEffect, useMemo, useState, useRef } from 'react';
import Avatar from '../reusables/Avatar';
import { IActiveRoom } from '@/Types/Room';
import getAvatarImage from '@/utils/getAvatarImage';
import MessageContainer from './MessageContainer';
import { IChatType } from '@/Types/Chat';
import axios, { AxiosResponse } from 'axios';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { useRoom } from '@/context/chat/RoomContextProvider';
import { RoomActionTypes } from '@/context/chat/roomActions';
import toast from 'react-hot-toast';
import { getSocket } from '@/utils/socketService';
import MessageInput from './MessageInput';

interface IChatArea {
    handleInfoOpen?: () => void;
    room: IActiveRoom;
}

function ChatArea(props: IChatArea) {
    const { room } = props;
    const auth = useAuth();
    const { state, dispatch } = useRoom();
    const divref = createRef<HTMLDivElement>();

    const [typingUser, setTypingUser] = useState<string | null>(null);

    const socket = useMemo(() => getSocket(), []);
    useEffect(() => {
        if (divref.current) {
            divref.current.scrollTo({
                top: divref.current.scrollHeight + 30,
                behavior: 'smooth',
            });
        }
    }, [state.activeRoom?.messages, divref]);
    const roomImage = useMemo(() => getAvatarImage(room.roomImage, room.isGroupChat), [room]);

    const handleSendMessage = async (e: SyntheticEvent, message: string) => {
        e.preventDefault();
        if (!auth.state.user) {
            toast.error('User not authorized');
            return;
        }
        if (message.length < 1) return;
        try {
            const res: AxiosResponse<IChatType> = await axios.post('/chat', {
                message,
                roomId: room._id,
            });

            const chat = {
                ...res.data,
                sender: auth.state.user,
            };

            dispatch({ type: RoomActionTypes.AppendChatToRoom, payload: chat });
            socket.emit('newMessage', { ...chat, room: state.activeRoom });
        } catch (err: any) {
            toast.error(err.response?.data.message);
        }
    };

    useEffect(() => {
        socket.on('typing', (userImage: string) => setTypingUser(userImage));
        socket.on('stopTyping', () => setTypingUser(null));
        socket.on('messageReceived', (message: IChatType) => {
            dispatch({ type: RoomActionTypes.AppendChatToRoom, payload: message });
        });
    }, [socket, dispatch]);

    useEffect(() => {
        console.log(typingUser);
    }, [typingUser]);

    

    return (
        <div className="flex chatsection relative  flex-col h-full w-full">
            <div className="flex justify-between p-4 items-center">
                <div
                    onClick={() => {
                        props.handleInfoOpen && props.handleInfoOpen();
                    }}
                    className="personinfo flex flex-row gap-2 items-center cursor-pointer"
                >
                    <Avatar className="min-h-[50px] w-[50px]" source={roomImage} />
                    <div className={`messageContent  text-white`}>
                        <h2 className="text-md font-medium">{room.roomName}</h2>
                        {/* <p className="text-xs font-thin -mt-1">online</p> */}
                    </div>
                </div>
                <div className="buttons flex gap-4">
                    <FontAwesomeIcon icon={faPhone} style={{ color: 'white' }} />
                    <FontAwesomeIcon icon={faVideoCamera} style={{ color: 'white' }} />
                    <FontAwesomeIcon icon={faTrashCan} style={{ color: 'white' }} />
                </div>
            </div>
            <div  ref={divref} className="max-h-[75%] overflow-y-scroll no-scrollbar flex flex-col flex-1 w-full">
                <div className="flex p-4  flex-1 min-w-full">
                    <div
                       
                        className="message-container w-full py-2 overflow-y-scroll no-scrollbar overflow-x-hidden flex flex-col"
                    >
                        <MessageContainer messages={room.messages} />
                    </div>
                </div>
                <MessageInput handleSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}

export default ChatArea;
