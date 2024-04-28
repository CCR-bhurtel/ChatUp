import { AuthActionTypes, AuthActions } from './authActions';

import { AuthStateInterface } from './AuthContextProvider';

const authReducer = (state: AuthStateInterface, action: AuthActions): AuthStateInterface => {
    switch (action.type) {
        case AuthActionTypes.LoggingUser:
            return { ...state, loading: true };
        case AuthActionTypes.LoadUser:
            return { ...state, isLoggedIn: true, loading: false, user: action.payload };

        case AuthActionTypes.UserLoginFail:
            return { ...state, isLoggedIn: false, loading: false, user: undefined };
        case AuthActionTypes.EditInfo:
        case AuthActionTypes.EditPreferences:
        case AuthActionTypes.EditProfileImage:
        case AuthActionTypes.BlockUser:
        case AuthActionTypes.UnblockUser:
            return { ...state, user: action.payload };

        case AuthActionTypes.RemoveUser:
        case AuthActionTypes.LogOut:
            return { ...state, isLoggedIn: false, user: undefined };
        case AuthActionTypes.SocketConnected:
            return { ...state, socketConnected: action.payload };

        case AuthActionTypes.LoadActiveUsers:
            return { ...state, activeUsers: action.payload };
        default:
            return state;
    }
};

export default authReducer;
