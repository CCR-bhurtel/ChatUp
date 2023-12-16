import Navbar from '@/components/layouts/Navbar';
import { BASE_API_PATH } from '@/config/keys';
import AuthContextProvider from '@/context/auth/AuthContextProvider';
import RoomContextProvider from '@/context/chat/RoomContextProvider';
import '@/styles/globals.css';
import { getSocket, initSocket } from '@/utils/socketService';
import axios from 'axios';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
    axios.defaults.baseURL = BASE_API_PATH;
    axios.defaults.withCredentials = true;
    useEffect(() => {
        initSocket();
        
    }, []);

    return (
        <div className="h-screen relative overflow-hidden flex flex-col">
            <Toaster />
            <div className="backgroundlayer  hidden bg-lightnavy z-[-1] absolute inset-0"></div>

            <AuthContextProvider>
                <RoomContextProvider>
                    <>
                        <>
                            <Navbar />
                            <Component {...pageProps} />
                        </>
                    </>
                </RoomContextProvider>
            </AuthContextProvider>
        </div>
    );
}
