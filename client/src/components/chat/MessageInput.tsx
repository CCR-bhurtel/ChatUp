import { faFaceSmile, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';
import data, { Skin } from '@emoji-mart/data';
import { useState, useRef, useEffect, ChangeEvent, SyntheticEvent, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSocket } from '@/utils/socketService';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { useRoom } from '@/context/chat/RoomContextProvider';

interface Props {
    handleSendMessage: (e: SyntheticEvent, message: string) => Promise<void>;
}

function MessageInput({ handleSendMessage }: Props) {
    const [message, setMessage] = useState<string>('');
    const [showPicker, setShowPicker] = useState(false);

    const [isTyping, setIsTyping] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const auth = useAuth();
    const roomContext = useRoom();

    const room = useMemo(() => roomContext, []);

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

    const socket = useMemo(() => getSocket(), []);

    const [currentTimeoutId, setCurrentTimeoutId] = useState<string | number | NodeJS.Timeout | undefined>(0);

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (!isTyping) {
            setIsTyping((prev) => true);
            socket.emit('typing', {
                roomId: room.state.activeRoom?._id,
                profilePic: auth.state.user?.profilePic,
                userId: auth.state.user?._id,
            });
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
        }
        let timeoutId = setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength) {
                socket.emit('stopTyping', {
                    roomId: room.state.activeRoom?._id,
                    userId: auth.state.user?._id,
                });
                setIsTyping(false);
            }
        }, timerLength);
        setCurrentTimeoutId(timeoutId);
    };

    const handleSend = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSendMessage(e, message);
        setMessage('');
        if (currentTimeoutId) clearTimeout(currentTimeoutId);
        setIsTyping(false);
        socket.emit('stopTyping', {
            roomId: room.state.activeRoom?._id,
            userId: auth.state.user?._id,
        });
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
                <button
                    type="submit"
                    className="sendButton bg-navy hover:bg-secondary px-4 items-center justify-center flex rounded-tr-md rounded-br-md"
                >
                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'white' }} />
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
