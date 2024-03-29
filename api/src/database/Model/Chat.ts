import mongoose from "mongoose";

import { IChat, ChatModel } from "../../Types/Chat";
import Media from "./Media";

const chatSchema = new mongoose.Schema<IChat, ChatModel>(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (this: IChat, val: string) {
          if (this.messageType !== "Info") {
            if (!val) {
              return false;
            } else {
              return true;
            }
          }
        },
        message: "Sender is required",
      },
    },
    messageType: {
      type: String,
      enum: ["Text", "File", "Info"],
      default: "Text",
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
    },

    textContent: { type: String },
    read: { type: Boolean, default: false },

    media: {
      type: mongoose.Types.ObjectId,
      ref: "Media",
      validate: {
        validator: function (this: IChat, val: string) {
          if (this.messageType === "File") {
            return val.length;
          }
        },
        message: "Media id is required",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const preSchemaMethods: string[] = [
  "deleteOne",
  "deleteMany",
  "findByIdAndDelete",
  "findOneAndDelete",
];
const regexPattern = new RegExp(preSchemaMethods.join("|"), "g");
chatSchema.pre(regexPattern, async function (this: IChat, next) {
  if (this.messageType === "Media") {
    try {
      // file should be deleted in media's middleware
      await Media.findByIdAndDelete(this.media);
      next();
    } catch (err: any) {
      next(err);
    }
  }
});

export default mongoose.model("Chat", chatSchema);
