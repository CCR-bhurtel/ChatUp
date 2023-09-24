import { Mixed, Model, Types } from 'mongoose';
import { Request } from 'express';

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
    profilePic?: String;
    resetToken?: String;
    resetTokenExpires?: Date;
    blockedUsers: [Types.ObjectId];
    settingId?: Types.ObjectId;
    passwordChangedAt: Date;
    contactNumber: string;
    preferences: {
        email: boolean;
        message: boolean;
        notification: boolean;
    };
}

export interface IUserMethods {
    checkPassword: (providedPassword: string) => Promise<boolean>;
}

export interface ExpressRequest extends Request {
    user: PopulatedUser;
}

export type PopulatedUser = Pick<
    IUser,
    'name' | 'email' | 'location' | 'registerType' | 'profilePic' | 'blockedUsers' | 'preference'
> & {
    _id: Types.ObjectId;
    _doc?: Mixed;
};

export type UserModel = Model<IUser, {}, IUserMethods>;
