import { IUserType } from '@/Types/User';
import React, { Dispatch, ReactElement, createContext, useContext, useEffect, useReducer } from 'react';
import { AuthActionTypes, AuthActions } from './authActions';
import authReducer from './authReducer';
import axios, { AxiosResponse } from 'axios';
import { BASE_API_PATH } from '@/config/keys';
import { useRouter } from 'next/router';

export interface AuthStateInterface {
    user?: IUserType;
    loading: boolean;
    isLoggedIn: boolean;
}

const INITIAL_STATE: AuthStateInterface = {
    user: undefined,
    loading: false,
    isLoggedIn: false,
};

export const AuthContext = createContext<{
    state: AuthStateInterface;
    dispatch: Dispatch<AuthActions>;
}>({ state: INITIAL_STATE, dispatch: () => undefined });

export const useAuth = () => useContext(AuthContext);

const loadUser = async (dispatch: React.Dispatch<AuthActions>) => {
    try {
        const response: AxiosResponse<IUserType> = await axios.get(`/user/`, { withCredentials: true });

        const data = response.data;
        dispatch({ type: AuthActionTypes.LoadUser, payload: data });
    } catch (err) {
        dispatch({ type: AuthActionTypes.UserLoginFail, payload: undefined });
    }
};

function AuthContextProvider(props: { children: ReactElement }) {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    const router = useRouter();
    useEffect(() => {
        if (!state.loading) {
            if (!state.isLoggedIn && !router.pathname.includes('auth')) {
                router.push('/auth/login');
            } else if (state.isLoggedIn && (router.pathname.includes('auth') || router.pathname === '/')) {
                router.push('/chat');
            }
        }
    }, [state, router]);

    useEffect(() => {
        loadUser(dispatch);
    }, []);
    return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvider;
