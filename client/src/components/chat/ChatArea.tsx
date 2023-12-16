import {
    faFaceSmile,
    faPaperPlane,
    faPaperclip,
    faPhone,
    faTrashCan,
    faVideoCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef, useEffect, useMemo } from 'react';
import Avatar from '../reusables/Avatar';
import { userData } from '@/data/testUser';
import { IActiveRoom } from '@/Types/Room';
import getAvatarImage from '@/utils/getAvatarImage';
import MessageContainer from './MessageContainer';

interface IChatArea {
    handleInfoOpen?: () => void;
    room: IActiveRoom;
}
function ChatArea(props: IChatArea) {
    const { room } = props;
    const divref = createRef<HTMLDivElement>();
    useEffect(() => {
        if (divref.current) {
            divref.current.scrollTo({
                top: divref.current.scrollHeight + 30,
                behavior: 'smooth',
            });
        }
    }, []);
    const roomImage = useMemo(() => getAvatarImage(room.roomImage, room.isGroupChat), [room]);
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
            <div className="chatsection relative flex  px-4 min-h-[87%] overflow-hidden min-w-full ">
                <div
                    ref={divref}
                    className="message-container min-h-[80vh] w-full mb-20 py-2 overflow-y-scroll overflow-x-hidden flex flex-col "
                >
                    <MessageContainer />
                </div>
            </div>
            <div className="messageBox absolute w-full justify-center  bottom-5  flex">
                <div className="bg-cgray p-4 rounded-tl-xl text-sm rounded-bl-xl flex  ">
                    <input
                        type="text"
                        className="w-[250px] outline-none placeholder:font-thin text-white font-light text-sm placeholder:text-white bg-transparent focus:bg-transparent border-none outline-0 focus:outline-0"
                        placeholder="Your message here "
                    />
                    <div className="flex justify-around min-w-[15%]">
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
