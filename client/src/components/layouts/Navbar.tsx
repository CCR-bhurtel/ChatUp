import React, { useState } from 'react';
import Logo from '../../assets/images/logo.svg';
import Link from 'next/link';
import Avatar from '../reusables/Avatar';
import logout from '../../assets/icons/logout.svg';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(true);
    return (
        <div className="w-100 flex items-center justify-between py-8 px-4 relative h-10">
            <Link href="/" replace={true}>
                <img src={Logo.src} alt="Chatup logo" className="w-20" />
            </Link>
            {loggedIn ? (
                <div className="clickables flex flex-row items-center gap-2 ">
                    <Avatar
                        className="h-[40px] w-[40px] "
                        source="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D"
                    />
                    <img src={logout.src} className='w-[25px]' alt="" />
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

export default Navbar;
