import { IMedia } from "./Media";
import { IRoomType } from "./Room";
import { ISimpleUser } from "./User";

export interface IChatType {
  _id: string;
  sender: ISimpleUser;
  messageType: "Text" | "File" | "Media" | "Info";
  textContent?: string;
  media?: IMedia;
  isDeleted: boolean;
  room: string;
  createdAt: Date;
}
