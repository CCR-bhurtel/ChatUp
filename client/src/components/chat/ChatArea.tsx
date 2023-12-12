import {
    faFaceSmile,
    faPaperPlane,
    faPaperclip,
    faPhone,
    faTrashCan,
    faVideoCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef, useEffect } from 'react';
import Avatar from '../reusables/Avatar';
import { userData } from '@/data/testUser';

interface IChatArea {
    handleInfoOpen?: () => void;
}
function ChatArea(props: IChatArea) {
    const divref = createRef<HTMLDivElement>();
    useEffect(() => {
        if (divref.current) {
            divref.current.scrollTo({
                top: divref.current.scrollHeight + 30,
                behavior: 'smooth',
            });
        }
    }, []);
    return (
        <>
            <div className="flex  justify-between  p-4 items-center">
                <div
                    onClick={() => {
                        props.handleInfoOpen && props.handleInfoOpen();
                    }}
                    className="personinfo flex flex-row gap-2 items-center"
                >
                    <Avatar className="min-h-[50px] w-[50px]" source={userData.profilePic} />
                    <div className={`messageContent  text-white`}>
                        <h2 className="text-md font-medium">{userData.name}</h2>
                        <p className="text-xs font-thin -mt-1">online</p>
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
                    className="message-container mb-20 py-2 overflow-y-scroll overflow-x-hidden flex flex-col "
                >
                    <div className="messages mymessages mt-2 self-end text-white font-light leading-tight  flex items-end flex-col gap-2 w-[70%]">
                        <div className="message bg-purple p-4 pt-6 color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:30
                            </div>
                            Hello again
                        </div>
                        <div className="message bg-purple p-4 pt-6 color-white rounded-md relative ">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:30
                            </div>
                            Hey, thanks for riding me to home dude
                        </div>
                    </div>
                    <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                        <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:30
                            </div>
                            Hey dude, mention not
                        </div>
                    </div>

                    <div className="messages mymessages mt-2 self-end text-white font-light leading-tight  flex items-end flex-col gap-2 w-[70%]">
                        <div className="message bg-purple p-4 pt-6 color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:31
                            </div>
                            That was an awesome trip, we had yesterday.
                        </div>
                        <div className="message bg-purple p-4 pt-6 color-white rounded-md relative ">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:31
                            </div>
                            There should be more of it in future.
                        </div>
                    </div>

                    <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                        <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:32
                            </div>
                            Test message
                        </div>
                    </div>
                    <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                        <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:32
                            </div>
                            Test message 1
                        </div>
                    </div>
                    <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                        <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:32
                            </div>
                            Test message 1
                        </div>
                    </div>
                    <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                        <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:32
                            </div>
                            Test message 1
                        </div>
                    </div>
                    <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                        <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                            <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                08:32
                            </div>
                            Test message 1
                        </div>
                    </div>
                </div>
            </div>
            <div className="messageBox absolute left-[50%] -translate-x-[50%]  bottom-5  flex">
                <div className="bg-cgray p-4 rounded-tl-xl text-sm rounded-bl-xl flex  ">
                    <input
                        type="text"
                        className="w-[250px] placeholder:font-thin text-white font-light text-sm placeholder:text-white bg-transparent focus:bg-transparent border-none outline-0 focus:outline-0"
                        placeholder="Your message here "
                    />
                    <div className="flex justify-between w-[15%]">
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
