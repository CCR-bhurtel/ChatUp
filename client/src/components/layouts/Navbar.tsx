import React from 'react';
import Logo from '../../assets/images/logo.svg';

function Navbar() {
    return (
        <div className="w-100 flex items-center justify-start p-8">
            <img src={Logo.src} alt="Chatup logo" className="w-20" />
        </div>
    );
}

export default Navbar;
