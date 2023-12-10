import React from 'react';
import Gears from '../../assets/images/gear.gif';

function Loading() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <img src={Gears.src} className="h-[50px] w-[50px]" alt="Loading icon" />
        </div>
    );
}

export default Loading;
