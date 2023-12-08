import React from 'react';

interface IAvatar {
    source: string;
    className: string;
}
function Avatar({ className, source }: IAvatar) {
    return (
        <div className={`${className} rounded-[50%] overflow-hidden  object-none`}>
            <img src={source} alt="avatar img" />
        </div>
    );
}

export default Avatar;
