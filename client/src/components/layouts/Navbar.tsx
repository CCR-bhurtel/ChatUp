import Logo from '../../assets/images/logo.svg';
import Link from 'next/link';
import AccountClickables from '../account/AccountClickables';

function Navbar() {
    return (
        <div className="w-full top-0 left-0 z-10 flex items-center justify-between px-4 py-2">
            <Link href="/" replace={true}>
                <img src={Logo.src} alt="Chatup logo" className="w-20" />
            </Link>
            <div className="lg:hidden">
                <AccountClickables />
            </div>
        </div>
    );
}

export default Navbar;
