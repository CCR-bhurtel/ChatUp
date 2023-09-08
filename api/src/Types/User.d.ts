import { Model, Types } from 'mongoose';

export interface ReferenceType {
    type: Types.ObjectId;
    ref: String;
}

export interface IUser {
    name: string;
    location: string;
    registerType: 'EmailPassword' | 'Google' | 'Facebook';
    email?: string;
    password?: string;
    googleId?: String;
    facebookId?: String;
    profilePic?: String;
    resetToken?: String;
    blockedUsers: [Types.ObjectId];
    settingId?: Types.ObjectId;
    passwordChangedAt: Date;
}

export interface IUserMethods {
    checkPassword: (providedPassword: string) => Promise<boolean>;
}

export type PopulatedUser = Pick<
    IUser,
    'name' | 'email' | 'location' | 'registerType' | 'profilePic' | 'blockedUsers'
> & {
    _id: Types.ObjectId;
};

export type UserModel = Model<IUser, {}, IUserMethods>;
