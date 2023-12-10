import React from 'react';

interface IAvatar {
    source: string | undefined;
    className: string;
}
function Avatar({ className, source }: IAvatar) {
    return <img src={source} className={`${className} rounded-full object-cover object-top`} alt="avatar img" />;
}

export default Avatar;
