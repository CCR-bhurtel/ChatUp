import {
    faFaceSmile,
    faPaperPlane,
    faPaperclip,
    faPhone,
    faTrashCan,
    faVideoCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, SyntheticEvent, createRef, useEffect, useMemo, useState } from 'react';
import Avatar from '../reusables/Avatar';
import { userData } from '@/data/testUser';
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

interface IChatArea {
    handleInfoOpen?: () => void;
    room: IActiveRoom;
}
function ChatArea(props: IChatArea) {
    const { room } = props;
    const auth = useAuth();
    const { state, dispatch } = useRoom();
    const [message, setMessage] = useState<string>('');
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

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };
    const handleSendMessage = async (e: SyntheticEvent) => {
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
            setMessage('');

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
    }, []);
    return (
        <>
            <div className="flex  justify-between  p-4 items-center">
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
            <div className="chatsection relative flex  px-4 min-h-[87%]  min-w-full ">
                <div
                    ref={divref}
                    className="message-container   min-h-[70vh] md:min-h-[50vh] w-full mb-[20vh] py-2 overflow-y-scroll overflow-x-hidden flex flex-col "
                >
                    <MessageContainer messages={room.messages} />
                </div>
            </div>

            <div className="messageBox absolute w-full justify-center  bottom-2  flex">
                <div className="bg-cgray p-4 rounded-tl-xl text-sm rounded-bl-xl flex  ">
                    <form onSubmit={handleSendMessage} className="w-[150px]">
                        <input
                            value={message}
                            onChange={handleMessageChange}
                            type="text"
                            className="w-full outline-none placeholder:font-thin text-white font-light text-sm placeholder:text-white bg-transparent focus:bg-transparent border-none outline-0 focus:outline-0"
                            placeholder="Your message here "
                        />
                    </form>

                    <div className="flex justify-around min-w-[15%] gap-2">
                        <FontAwesomeIcon icon={faPaperclip} style={{ color: 'white' }} />
                        <FontAwesomeIcon icon={faFaceSmile} style={{ color: 'white' }} />
                    </div>
                </div>
                <div className="sendButton bg-navy hover:bg-secondary px-4 items-center justify-center flex rounded-tr-md rounded-br-md">
                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'white' }} />
                </div>
            </div>
        </>
    );
}

export default ChatArea;
