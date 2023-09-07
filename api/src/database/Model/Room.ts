import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
    roomName: String,
    isGroupChat: Boolean,
    chatMessages: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Chat',
        },
    ],

    users: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
    roomImage: {
        type: String,
    },
    roomAdmin: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },

    sharedFiles: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Media',
        },
    ],

    blockedUsers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
});

export default mongoose.model('Room', roomSchema);
