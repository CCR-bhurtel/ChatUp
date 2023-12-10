import Loading from '@/components/reusables/Loading';
import { useAuth } from '@/context/auth/AuthContextProvider';

export default function Home() {
    const { state } = useAuth();

    return <>{state.loading ? <Loading /> : ''}</>;
}
