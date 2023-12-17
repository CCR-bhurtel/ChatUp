import { faFaceSmile, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';
import data, { Skin } from '@emoji-mart/data';
import { useState, useRef, useEffect, ChangeEvent, SyntheticEvent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSocket, initSocket } from '@/utils/socketService';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { useRoom } from '@/context/chat/RoomContextProvider';

interface Props {
    handleSendMessage: (e: SyntheticEvent, message: string) => Promise<void>;
}

function MessageInput({ handleSendMessage }: Props) {
    const [message, setMessage] = useState<string>('');
    const [showPicker, setShowPicker] = useState(false);

    const [typing, setTyping] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const auth = useAuth();

    const room = useRoom();

    const onEmojiClick = (obj: Skin) => {
        setMessage(message + obj.native);
        setShowPicker(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    let timeOut: string | number | NodeJS.Timeout | undefined;

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        let socket = getSocket();
        if (!socket) {
            initSocket();
            socket = getSocket();
        }
        if (!typing) {
            setTyping(true);
            socket.emit('typing', {
                room: room.state.activeRoom,
                profilePic: auth.state.user?.profilePic,
                userId: auth.state.user?._id,
            });
        }

        if (timeOut) clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            setTyping(false);
            socket.emit('stopTyping', {
                room: room.state.activeRoom?._id,
                userId: auth.state.user?._id,
            });
        }, 3000);
    };

    const handleSend = (e: SyntheticEvent) => {
        e.preventDefault();
        handleSendMessage(e, message);
        setMessage('');
    };

    return (
        <div className="messageBox absolute w-full justify-center self-end bottom-2 flex p-4">
            <form onSubmit={handleSend} className="flex flex-row flex-1">
                <div className="bg-cgray p-4 rounded-tl-xl text-sm rounded-bl-xl flex flex-1 items-center">
                        <input
                            value={message}
                            onChange={handleMessageChange}
                            type="text"
                            className="w-full outline-none placeholder:font-thin text-white font-light text-sm placeholder:text-white bg-transparent focus:bg-transparent border-none outline-0 focus:outline-0"
                            placeholder="Your message here "
                        />

                    <div className="flex md:relative  gap-2 self-end justify-end">
                        <FontAwesomeIcon icon={faPaperclip} style={{ color: 'white' }} />

                        <div className="emojicontainer ">
                            <FontAwesomeIcon
                                icon={faFaceSmile}
                                style={{ color: 'white', cursor: 'pointer' }}
                                onClick={() => setShowPicker(true)}
                                />
                            {showPicker && (
                                <div className="absolute left-0 bottom-10 md:left-auto md:right-0" ref={emojiPickerRef}>
                                    <Picker data={data} onEmojiSelect={onEmojiClick} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button type="submit" className="sendButton bg-navy hover:bg-secondary px-4 items-center justify-center flex rounded-tr-md rounded-br-md">
                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'white' }} />
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
