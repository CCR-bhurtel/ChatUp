import React, { use } from 'react';
import { TypingUser } from './ChatArea';
import getAvatarImage from '@/utils/getAvatarImage';
import Avatar from '../reusables/Avatar';
import animationData from '../../assets/animations/typing.json';
import Lottie from 'react-lottie';
import { useAuth } from '@/context/auth/AuthContextProvider';

interface TypingContianer {
    users: TypingUser[];
}

function UserStack({ users }: TypingContianer) {
    
    return (
        <div className="flex flex-row items-start justify-start ">
            {users.map((user) => {
                const userImage = getAvatarImage(user.profilePic, false);
                return <Avatar source={userImage} className=" h-[1.5rem] w-[1.5rem]" />;
            })}
        </div>
    );
}
function TypingContainer(props: TypingContianer) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    return props.users.length ? (
        <div className="flex flex-row items-center justify-start mt-2 gap-2">
            <UserStack users={props.users} />
            <Lottie options={defaultOptions} height={35} width={75} style={{ margin: '0' }} />
        </div>
    ) : (
        <></>
    );
}

export default TypingContainer;
