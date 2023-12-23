/* eslint-disable react-hooks/rules-of-hooks */
import { IUserType } from '@/Types/User';
import { getSocket } from './socketService';
import { AuthActionTypes } from '@/context/auth/authActions';
import { useAuth } from '@/context/auth/AuthContextProvider';

interface OnlineStatus {
    userId: string;
    online: boolean;
}
export default function getOnlineStatus() {
    const { dispatch } = useAuth();
    const socket = getSocket();

    // const userIDs = users.map((user) => user._id);

    socket.emit('getOnlineStatus');

    socket.on('onlineStatusReceived', (activeUsers: string[]) => {
        dispatch({ type: AuthActionTypes.LoadActiveUsers, payload: activeUsers });
    });
}
