import React, { useState } from 'react';
import Logo from '../../assets/images/logo.svg';
import Link from 'next/link';
import Avatar from '../reusables/Avatar';
import logout from '../../assets/icons/logout.svg';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { AuthActionTypes } from '@/context/auth/authActions';
import { useRouter } from 'next/router';
import { BASE_PATH } from '@/config/keys';

function Navbar() {
    const {
        state: { isLoggedIn, user },
        dispatch,
    } = useAuth();

    const router = useRouter();

    const handleLogOut = () => {
        document.cookie = `Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        dispatch && dispatch({ type: AuthActionTypes.LogOut, payload: undefined });
        router.push('/auth/login');
    };
    return (
        <div className="w-100 flex items-center justify-between py-8 px-4 relative h-10">
            <Link href="/" replace={true}>
                <img src={Logo.src} alt="Chatup logo" className="w-20" />
            </Link>
            {isLoggedIn ? (
                <div className="clickables flex flex-row items-center gap-2 ">
                    <Avatar
                        className="h-[40px] w-[40px] "
                        source={user && `${BASE_PATH}/images/userImages/${user.profilePic}`}
                    />
                    <img onClick={handleLogOut} src={logout.src} className="w-[25px]" alt="" />
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

export default Navbar;
