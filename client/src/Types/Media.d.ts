import { Model, Types } from "mongoose";

export interface IMedia {
  _id: string;
  name: string;

  type: string;
  downloadUrl: string;
  roomId: Types.ObjectId;
}

export interface IMediaMethods {}

export type MediaModel = Model<IMedia, {}, IMediaMethods>;
