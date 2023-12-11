import { Request } from 'express';
import User from '../../database/Model/User';
import Email from '../../services/Email';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';
import crypto from 'crypto';
import pug from 'pug';
import path from 'path';

const forgotPasswordHandler = catchAsync(async (req: Request, res, next) => {
    const { email } = req.body;
    console.log(email);

    if (!email) return next(new AppError('Please provide email', 400));

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('No user with given email', 400));
    }

    const resetToken = crypto.randomBytes(12).toString('hex');

    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 360000);

    await user.save();

    const resetUrl = `${req.headers.origin}/auth/resetpassword/?token=${resetToken}`;

    if (!user.email && !req.body.email) {
        return next(new AppError('Email id not found', 400));
    }

    const forgotPasswordHTML = pug.renderFile(`${path.join(__dirname, '../../../templates/forgotpassword.pug')}`, {
        username: user.name,
        resetURL: resetUrl,
        logoURL: `${req.headers.origin}/images/logo.svg`,
    });

    const emailService = new Email(
        user.name,
        user.email || req.body.email,
        'Forgot password',
        forgotPasswordHTML,
        'html'
    );
    const emailResponse = await emailService.sendMail();
    return res.status(200).json({ message: 'Email sent successfully', detailedResponse: emailResponse });
});

export default forgotPasswordHandler;
