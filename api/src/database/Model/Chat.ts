import mongoose from 'mongoose';

import { IChat, ChatModel } from '../../../Types/Chat';

import Media from './Media';

const chatSchema = new mongoose.Schema<IChat, ChatModel>({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required field'],
    },
    messageType: {
        type: String,
        enum: ['Text', 'File'],
        default: 'Text',
    },

    mediaId: {
        type: mongoose.Types.ObjectId,
        ref: 'Media',
        validate: {
            validator: function (val) {
                if (this.messageType === 'File') {
                    return val.length > 0;
                }
            },
            message: 'Media id is required',
        },
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const preSchemaMethods: string[] = ['deleteOne', 'deleteMany', 'findByIdAndDelete', 'findOneAndDelete'];
const regexPattern = new RegExp(preSchemaMethods.join('|'), 'g');
chatSchema.pre(
    regexPattern,
    async function (next) {
        if (this.type === 'Media') {
            try {
                // file should be deleted in media's middleware
                await Media.findByIdAndDelete(this._id);
                next();
            } catch (err) {
                next(err);
            }
        }
    }.bind(chatSchema)
);

module.exports = mongoose.model('Chat', chatSchema);
