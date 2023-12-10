import Link from 'next/link';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMessage, faGear } from '@fortawesome/free-solid-svg-icons';

interface IChatFooter {
    handleGroupChatOpen: () => void;
}
function ChatFooter(props: IChatFooter) {
    return (
        <div className="fixed flex justify-around items-center bottom-0 z-10 bg-lightnavy p-4 md:hidden left-0 right-0">
            <div className="cursor-pointer">
                <FontAwesomeIcon onClick={props.handleGroupChatOpen} icon={faPencil} style={{ color: 'white' }} />
            </div>
            <div className="cursor-pointer">
                <FontAwesomeIcon icon={faMessage} style={{ color: '#4044ED' }} />
            </div>
            <div className="cursor-pointer">
                <FontAwesomeIcon icon={faGear} style={{ color: 'white' }} />
            </div>
        </div>
    );
}

export default ChatFooter;
