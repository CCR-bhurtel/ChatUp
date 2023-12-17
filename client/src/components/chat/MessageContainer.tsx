import React from 'react';
import Avatar from '../reusables/Avatar';
import { IChatType } from '@/Types/Chat';
import { useAuth } from '@/context/auth/AuthContextProvider';
import getAvatarImage from '@/utils/getAvatarImage';

export interface IMessageContainer {
    messages: IChatType[];
}
function MessageContainer(props: IMessageContainer) {
    const { state } = useAuth();
    return (
        <>
            {props.messages.map((message, i) => {
                const date = new Date(message.createdAt);
                const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                if (message.sender._id === state.user?._id) {
                    return (
                        <div className="mymessages mt-2 self-end text-white font-light leading-tight  flex items-end flex-col gap-2 w-[70%]">
                            <div className="messages flex gap-2 flex-col">
                                <div className="message bg-purple p-4 pt-6 color-white rounded-md relative text-sm">
                                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                        {formattedTime}
                                    </div>
                                    {message.textContent}
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="others mt-2 self-start text-white font-light leading-tight justify-start  flex items-end flex-row gap-2 w-[70%]">
                            <div
                                className={`avatardiv
                             ${
                                 message.sender._id === props.messages[i + 1]?.sender._id &&
                                 'opacity-0 pointer-events-none'
                             }`}
                            >
                                <Avatar
                                    className={`
                                    h-[25px] w-[25px]`}
                                    source={getAvatarImage(message.sender.profilePic)}
                                />
                            </div>
                            <div className="message self-justify-self-start bg-storm p-4 pt-6  color-white rounded-md relative text-sm">
                                <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                                    {formattedTime}
                                </div>
                                {message.textContent}
                            </div>
                        </div>
                    );
                }
            })}
        </>
    );
}

export default MessageContainer;
