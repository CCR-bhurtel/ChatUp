const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
    },
    location: String,
    registerType: {
        type: String,
        enum: ['EmailPassword', 'Google', 'Facebook'],
        default: 'EmailPassword',
    },

    email: {
        type: String,
        unique: true,
        validate: {
            validator: (val) => {
                if (this.registerType === 'EmailPassword') {
                    return val.length > 0;
                }
            },
            message: 'Email is required',
        },
    },
    password: {
        type: String,
        validate: {
            validator: (val) => {
                if (this.registerType === 'EmailPassword') {
                    return val.length > 6;
                }
            },
            message: 'Password is required and its length should be greater than 6',
        },
    },
    googleId: String,
    facebookId: String,
    profilePic: String,
    resetToken: String,

    chatRooms: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Room',
        },
    ],
    blockedUsers: [
        {
            type: mongoose.Type.ObjectId,
            ref: 'User',
        },
    ],

    settingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Setting',
    },
    passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = new Date();
    next();
});

userSchema.methods.checkPassword = async (actualPassword, providedPassword) => {
    return await bcrypt.compare(actualPassword, providedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
