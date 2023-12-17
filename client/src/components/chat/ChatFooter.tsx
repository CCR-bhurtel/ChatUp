import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMessage, faGear } from '@fortawesome/free-solid-svg-icons';
import AccountClickables from '../account/AccountClickables';

interface IChatFooter {
    handleGroupChatOpen: () => void;
}

function ChatFooter(props: IChatFooter) {
    return (
        <div className="block lg:hidden p-4">
            <div className="flex w-full p-2 justify-between lg:flex-col lg:w-auto lg:items-center lg:h-auto lg:gap-6">
                <div className="cursor-pointer">
                    <FontAwesomeIcon onClick={props.handleGroupChatOpen} icon={faPencil} style={{ color: 'white', height: '20px', width: '20px' }} />
                </div>
                <div className="cursor-pointer">
                    <FontAwesomeIcon icon={faMessage} style={{ color: '#4044ED' }} />
                </div>
                <div className="cursor-pointer">
                    <FontAwesomeIcon icon={faGear} style={{ color: 'white' }} />
                </div>
            </div>
            <div className="hidden">
                <AccountClickables />
            </div>
        </div>
    );
}

export default ChatFooter;
