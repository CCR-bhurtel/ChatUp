import React, { ChangeEventHandler } from 'react';

interface InputProps {
    placeholder?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    name: string;
    type: string;
    borderclass?: string;
    value?: string;
}
function Input(props: InputProps) {
    return (
        <div className="input-item mt-2 w-full">
            <div className="relative h-11 w-full">
                <input
                    className={`peer h-full w-full  border-b-2 ${
                        props.borderclass || 'border-blue-gray-200 focus:border-gray-200 text-white'
                    } bg-transparent pt-4 pb-1.5 text-sm font-normal  outline outline-0 transition-all placeholder-shown:border-blue-gray-200  px-2 focus:bg-transparent focus:outline-0 `}
                    {...props}
                />
            </div>
        </div>
    );
}

export default Input;
