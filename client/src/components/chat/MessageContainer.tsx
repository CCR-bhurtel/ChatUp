import React from 'react';

function MessageContainer() {
    return (
        <>
            <div className="messages mymessages mt-2 self-end text-white font-light leading-tight  flex items-end flex-col gap-2 w-[70%]">
                <div className="message bg-purple p-4 pt-6 color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:30</div>
                    Hello again
                </div>
                <div className="message bg-purple p-4 pt-6 color-white rounded-md relative ">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:30</div>
                    Hey, thanks for riding me to home dude
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:30</div>
                    Hey dude, mention not
                </div>
            </div>

            <div className="messages mymessages mt-2 self-end text-white font-light leading-tight  flex items-end flex-col gap-2 w-[70%]">
                <div className="message bg-purple p-4 pt-6 color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:31</div>
                    That was an awesome trip, we had yesterday.
                </div>
                <div className="message bg-purple p-4 pt-6 color-white rounded-md relative ">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:31</div>
                    There should be more of it in future.
                </div>
            </div>

            {/* <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div>
            <div className="messages others mt-2 self-start text-white font-light leading-tight  flex items-start flex-col gap-2 w-[70%]">
                <div className="message bg-storm p-4 pt-6  color-white rounded-md relative">
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">08:32</div>
                    Test message 1
                </div>
            </div> */}
        </>
    );
}

export default MessageContainer;
