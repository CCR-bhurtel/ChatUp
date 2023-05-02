const mongoose = require('mongoose');
const Media = require('./Media');
const fs = require('fs');

const chatSchema = new mongoose.Schema({
    sendingUser: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required field'],
    },
    messageType: {
        type: String,
        enum: ['Normal', 'File'],
        default: 'Normal',
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

chatSchema.pre(['deleteOne', 'deleteMany', 'findByIdAndDelete', 'findOneAndDelete'], async function (next) {
    if (this.type === 'Media') {
        try {
            // file should be deleted in media's middleware
            await Media.findByIdAndDelete(this._id);
            next();
        } catch (err) {
            next(err);
        }
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
