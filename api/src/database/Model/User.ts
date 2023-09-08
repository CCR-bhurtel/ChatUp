import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser, IUserMethods, UserModel } from '../../Types/User';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    name: {
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
            validator: function (this: IUser, val: string) {
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
            validator: function (this: IUser, val: string) {
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

    blockedUsers: [
        {
            type: mongoose.Types.ObjectId,
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

    this.password = await bcrypt.hash(this.password as string, 12);
    this.passwordChangedAt = new Date();
    next();
});

userSchema.methods.checkPassword = async function (providedPassword: string): Promise<boolean> {
    return bcrypt.compare(this.password, providedPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
