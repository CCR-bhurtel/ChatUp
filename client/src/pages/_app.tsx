import Navbar from '@/components/layouts/Navbar';
import Loading from '@/components/reusables/Loading';
import { BASE_API_PATH } from '@/config/keys';
import AuthContextProvider, { AuthContext, useAuth } from '@/context/auth/AuthContextProvider';
import RoomContextProvider from '@/context/chat/RoomContextProvider';
import '@/styles/globals.css';
import axios from 'axios';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
    axios.defaults.baseURL = BASE_API_PATH;

    const { state } = useContext(AuthContext);

    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <Toaster />
            <div className="backgroundlayer  hidden bg-lightnavy z-[-1] absolute inset-0"></div>

            <AuthContextProvider>
                <RoomContextProvider>
                    <>
                        {state.loading ? (
                            <Loading />
                        ) : (
                            <>
                                <Navbar />
                                <Component {...pageProps} />
                            </>
                        )}
                    </>
                </RoomContextProvider>
            </AuthContextProvider>
        </div>
    );
}
