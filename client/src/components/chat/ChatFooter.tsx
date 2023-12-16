import Link from 'next/link';
import Logo from '../../assets/images/logo.svg';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMessage, faGear } from '@fortawesome/free-solid-svg-icons';
import AccountClickables from '../account/AccountClickables';

interface IChatFooter {
    handleGroupChatOpen: () => void;
}
function ChatFooter(props: IChatFooter) {
    return (
        <div className="fixed bottom-0 left-0 w-full flex items-end p-5 bg-lightnavy lg:h-[60%] lg:flex-col lg:max-w-[90px] lg:justify-between lg:items-center">
            <div className="flex w-full justify-between lg:flex-col lg:w-auto lg:items-center lg:h-auto lg:gap-6">
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
            <div className="lg:block hidden">
                <AccountClickables />
            </div>
        </div>
    );
}

export default ChatFooter;
