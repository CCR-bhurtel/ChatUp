import { IActiveRoom } from '@/Types/Room';
import React from 'react';
import Avatar from '../reusables/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRightFromBracket,
    faBan,
    faImage,
    faSearch,
    faUserFriends,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Switch } from '@material-tailwind/react';
import getAvatarImage from '@/utils/getAvatarImage';
export interface IRoomInfo {
    room: IActiveRoom | undefined;
    light?: boolean;
}
function RoomInfo({ room, light }: IRoomInfo) {
    return (
        <div className={`container ${light ? 'light' : 'dark'}`}>
            <div
                className={`bg-white min-w-[20rem] p-4 rounded-md dark:rounded-none dark:bg-lightnavy flex items-center justify-center`}
            >
                {room?.isGroupChat ? <RoomInfoGroup room={room} /> : <RoomInfoPrivate room={room} />}
            </div>
            ;
        </div>
    );
}

export default RoomInfo;

function RoomInfoPrivate({ room }: IRoomInfo) {
    const roomImage = room ? getAvatarImage(room.roomImage) : '';
    return (
        <div className="flex flex-col min-h-[300px]  items-center justify-between">
            <div className="row1">
                <div className="userInfo flex items-center  flex-col">
                    <Avatar source={roomImage} className="h-[80px] w-[80px]" />
                    <div className="userinfo_data text-navy dark:text-white text-center mt-2">
                        <h1 className=" font-semibold text-xl">{room?.roomName}</h1>
                        <div className="address font-light text-sm">{room?.users[0].location}</div>
                    </div>
                </div>
                <div className="useroptions mt-8 gap-2 flex flex-col items-start justify-center">
                    {/* to be added later,
                Search Messages,
                Shared Media,
             */}
                    <div className="seachMessage items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Search messages</span>
                    </div>{' '}
                    <div className="sharedMedia items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
                        <FontAwesomeIcon icon={faImage} />
                        <span>Shared media</span>
                    </div>
                </div>
            </div>

            <span className="blockUser text-navy flex w-full justify-between">
                <div className="label">
                    <FontAwesomeIcon icon={faBan} />
                    <span> Block User</span>
                </div>
                <Switch
                    containerProps={{
                        className: 'w-11 h-6',
                    }}
                    className="checked:bg-navy h-full w-full bg-transparent bg-slate-600"
                    circleProps={{
                        className: 'before:hidden left-0.5 border-none bg-white ',
                    }}
                    crossOrigin={''}
                />
            </span>
        </div>
    );
}
function RoomInfoGroup({ room }: IRoomInfo) {
    const roomImage = room ? getAvatarImage(room.roomImage, true) : '';

    return (
        <div className="flex flex-col min-h-[300px]  items-center ">
            <div className="row1">
                <div className="userInfo flex items-center  flex-col">
                    <Avatar source={roomImage} className="h-[80px] w-[80px]" />
                    <div className="userinfo_data text-navy dark:text-white text-center mt-2">
                        <h1 className=" font-semibold text-xl">{room?.roomName}</h1>
                        <div className="address font-light text-sm">{room?.users.length} members</div>
                    </div>
                </div>
                <div className="useroptions mt-8 gap-2 flex flex-col items-start justify-center">
                    <div className="seachMessage items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Search messages</span>
                    </div>{' '}
                    <div className="sharedMedia items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
                        <FontAwesomeIcon icon={faImage} />
                        <span>Shared media</span>
                    </div>
                </div>
            </div>

            <span className="members flex-col mt-4 text-navy dark:text-white flex items-start w-full">
                <div className="sectiontitle">
                    <FontAwesomeIcon icon={faUsers} />
                    <span className="ml-2">Members</span>
                </div>
                <div className="memberlist mt-2 items-start w-full flex flex-col gap-2">
                    {room?.users.map((user) => (
                        <div
                            key={user._id}
                            className="groupmember rounded-md text-lightnavy cursor-pointer bg-gray-200  dark:bg-transparent p-2 w-full flex flex-row gap-2 items-center justify-between"
                        >
                            <div className="info flex flex-row gap-2 items-center text-sm">
                                <div className="avatar relative">
                                    <Avatar source={getAvatarImage(user.profilePic)} className="h-[30px] w-[30px] " />

                                    <div className="status absolute top-0 right-0 bg-primary w-2 h-2 rounded-full"></div>
                                </div>
                                <span>{user.name}</span>
                            </div>
                            <FontAwesomeIcon icon={faUserFriends} className="text-xs" />
                        </div>
                    ))}
                </div>
            </span>

            <span className="leavegroup text-navy mt-4 flex w-full justify-between cursor-pointer">
                <span> Leave group</span>

                <div className="label">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </div>
            </span>
        </div>
    );
}
