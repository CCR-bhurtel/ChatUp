import Navbar from '@/components/layouts/Navbar';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="overflow-auto h-screen">
            <div className="backgroundlayer hidden bg-lightnavy z-[-1] absolute inset-0"></div>
            <Navbar />
            <Component {...pageProps} />
        </div>
    );
}
