import { IUserType } from '@/Types/User';

export enum AuthActionTypes {
    LoadUser,
    EditProfileImage,
    EditInfo,
    UserLoginFail,
    RemoveUser,
    LogOut,
    BlockUser,
    UnblockUser,
    EditPreferences,
    LoggingUser,
}

export interface LoggingUser {
    type: AuthActionTypes.LoggingUser;
    payload: undefined;
}
export interface Loaduser {
    type: AuthActionTypes.LoadUser;
    payload: IUserType;
}

export interface EditProfileImage {
    type: AuthActionTypes.EditProfileImage;
    payload: IUserType;
}

export interface EditInfo {
    type: AuthActionTypes.EditInfo;
    payload?: IUserType;
}

export interface EditPreferences {
    type: AuthActionTypes.EditPreferences;
    payload?: IUserType;
}

export interface UserLoginFail {
    type: AuthActionTypes.UserLoginFail;
    payload: undefined;
}

export interface RemoveUser {
    type: AuthActionTypes.RemoveUser;
    payload: undefined;
}

export interface Logout {
    type: AuthActionTypes.LogOut;
    payload: undefined;
}

export interface BlockUser {
    type: AuthActionTypes.BlockUser;
    payload: IUserType;
}

export interface UnblockUser {
    type: AuthActionTypes.UnblockUser;
    payload: IUserType;
}

export type AuthActions =
    | LoggingUser
    | Loaduser
    | EditProfileImage
    | EditInfo
    | EditPreferences
    | UserLoginFail
    | RemoveUser
    | Logout
    | BlockUser
    | UnblockUser;
