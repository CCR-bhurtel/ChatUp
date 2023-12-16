import React from 'react';

interface IAvatar {
    source: string | undefined;
    className: string;
}
function Avatar({ className, source }: IAvatar) {
    return (
        <img src={source} className={`${className} cursor-pointer rounded-full object-cover object-top`} alt="avt" />
    );
}

export default Avatar;
