import React, { MouseEventHandler, ReactNode } from 'react';

interface IButton {
    onClick: MouseEventHandler<HTMLElement>;
    children: ReactNode;
    dClass: string;
}
function Button(props: IButton) {
    const className = `w-full mt-2 p-4 ${props.dClass} font-normal text-sm flex items-center justify-center`;
    return (
        <div className={className} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default Button;
