import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

import { IUser, IUserMethods, UserModel } from '../../Types/User';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    name: {
        type: String,
        required: [true, 'Username is required'],
    },
    location: String,
    registerType: {
        type: String,
        enum: ['emailPassword', 'google', 'facebook'],
        default: 'emailPassword',
    },

    email: {
        type: String,
        unique: true,

        validate: {
            validator: function (this: IUser, val: string) {
                if (this.registerType === 'emailPassword') {
                    return val.length > 0 && validator.isEmail(val);
                }
            },
            message: 'Please enter valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        validate: {
            validator: function (this: IUser, val: string) {
                if (this.registerType === 'emailPassword') {
                    return val.length > 6;
                }
            },
            message: 'Password is required and its length should be greater than 6',
        },
    },
    googleId: String,
    facebookId: String,
    profilePic: { type: String, default: 'defaultProfilePic404.png' },
    resetToken: String,

    contactNumber: {
        type: String,
        validate: {
            validator: function (this: IUser, val: string) {
                return validator.isMobilePhone(val);
            },
            message: 'Please provide valid phone number',
        },
    },

    preferences: {
        notification: { type: Boolean, default: true },
        emails: { type: Boolean, default: false },
        messages: { type: Boolean, default: false },
    },
    resetTokenExpires: { type: Date, default: new Date() },

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
    passwordChangedAt: { type: Date, default: new Date() },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password) this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = new Date();
    next();
});

userSchema.methods.checkPassword = async function (providedPassword: string): Promise<boolean> {
    return bcrypt.compare(providedPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
