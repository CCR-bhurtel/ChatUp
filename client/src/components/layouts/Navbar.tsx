import React from 'react';
import Logo from '../../assets/images/logo.svg';
import Link from 'next/link';

function Navbar() {
    return (
        <div className="w-100 flex items-center justify-start py-8 px-4">
            <Link href="/auth/login" replace={true}>
                <img src={Logo.src} alt="Chatup logo" className="w-20" />
            </Link>
        </div>
    );
}

export default Navbar;
