import { IUserType } from '@/Types/User';
import React, { Dispatch, ReactElement, createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { AuthActionTypes, AuthActions } from './authActions';
import authReducer from './authReducer';
import axios, { AxiosResponse } from 'axios';
import { NextRouter, useRouter } from 'next/router';
import { getSocket } from '@/utils/socketService';

export interface AuthStateInterface {
    user?: IUserType;
    loading: boolean;
    isLoggedIn: boolean;
    socketConnected: boolean;
}

const INITIAL_STATE: AuthStateInterface = {
    user: undefined,
    loading: false,
    isLoggedIn: false,
    socketConnected: false,
};

export const AuthContext = createContext<{
    state: AuthStateInterface;
    dispatch: Dispatch<AuthActions>;
}>({ state: INITIAL_STATE, dispatch: () => undefined });

export const useAuth = () => useContext(AuthContext);

export const loadUser = async (dispatch: React.Dispatch<AuthActions>, router: NextRouter) => {
    try {
        dispatch({ type: AuthActionTypes.LoggingUser });
        const response: AxiosResponse<IUserType> = await axios.get(`/user/`, { withCredentials: true });

        const data = response.data;

        dispatch({ type: AuthActionTypes.LoadUser, payload: data });
        router.push('/chat');
    } catch (err) {
        router.push('/auth/login');
        dispatch({ type: AuthActionTypes.UserLoginFail, payload: undefined });
    }
};

function AuthContextProvider(props: { children: ReactElement }) {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    const router = useRouter();
    useEffect(() => {
        if (!state.loading) {
            if (!state.isLoggedIn && !router.pathname.includes('auth')) {
                // router.push('/auth/login');
            } else if (state.isLoggedIn && router.pathname.includes('auth')) {
                // router.push('/chat');
            }
        }
    }, [state, router]);
    let socket = useMemo(() => getSocket(), []);

    useEffect(() => {
        if (state.user && !socket.connected) {
            socket.emit('initialSetup', state.user);
        }

        socket.on('connected', () => {
            dispatch({ type: AuthActionTypes.SocketConnected, payload: true });
        });
    }, [state.isLoggedIn, router]);

    useEffect(() => {
        loadUser(dispatch, router);
    }, []);
    return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvider;
