import { Mixed, Model, Types } from "mongoose";
import { Request } from "express";
import { IChat } from "./Chat";

export interface ReferenceType {
  type: Types.ObjectId;
  ref: String;
  validate: (this: IChat, val: string) => void;
}

export interface IUser {
  _id: string;
  name: string;
  location: string;
  registerType: "emailPassword" | "google" | "facebook";
  email?: string;
  password?: string;
  googleId?: String;
  facebookId?: String;
  profilePic?: string;
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
  folderName: String;
}

export type PopulatedUser = Pick<
  IUser,
  | "name"
  | "email"
  | "location"
  | "registerType"
  | "profilePic"
  | "blockedUsers"
  | "preferences"
> & {
  _id: string;
  _doc?: Mixed;
};

export type UserModel = Model<IUser, {}, IUserMethods>;
