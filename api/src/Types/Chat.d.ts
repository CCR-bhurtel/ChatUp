import { Model, Types } from "mongoose";
import { IUser, ReferenceType } from "./User";
import { IRoom, PopulatedRoom } from "./Room";
import { IMedia } from "./Media";

export interface IChat {
  _id: string;
  sender: ReferenceType;
  messageType: "Text" | "File" | "Media";
  textContent?: String;
  media?: Types.ObjectId;
  isDeleted: false;
  room?: Types.ObjectId;
  verified: Booolean;
  read: Boolean;
}

export interface IPopulatedChat extends IChat {
  sender: IUser;
  room: PopulatedRoom;
  media: IMedia;
}

export type ChatModel = Model<IChat, {}, {}>;
