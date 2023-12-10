import { Mixed, Types } from 'mongoose';

export interface ReferenceType {
    type: Types.ObjectId;
    ref: String;
}

export interface IUser {
    name: string;
    location: string;
    registerType: 'emailPassword' | 'google' | 'facebook';
    email?: string;
    password?: string;
    googleId?: String;
    facebookId?: String;
    profilePic?: string;
    resetToken?: String;
    resetTokenExpires?: Date;
    blockedUsers: Types.ObjectId[];
    settingId?: Types.ObjectId;
    passwordChangedAt: Date;
    contactNumber: string;
    preferences: {
        email: boolean;
        message: boolean;
        notification: boolean;
    };
}

export interface IUserType extends IUser {
    blockedUsers: IUser[];
}

export interface IUserMethods {
    checkPassword: (providedPassword: string) => Promise<boolean>;
}

export type PopulatedUser = Pick<
    IUser,
    'name' | 'email' | 'location' | 'registerType' | 'profilePic' | 'blockedUsers' | 'preferences'
> & {
    _id: Types.ObjectId;
    _doc?: Mixed;
};

export type ISimpleUser = Pick<IUser, 'name' | 'email' | 'location' | 'profilePic'> & {
    _id: Types.ObjectId;
};
