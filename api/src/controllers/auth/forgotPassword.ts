import { Request } from 'express';
import User from '../../database/Model/User';
import Email from '../../services/Email';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';
import crypto from 'crypto';

const forgotPasswordHandler = catchAsync(async (req: Request, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return new AppError('No user with given email', 400);
    }

    const resetToken = crypto.randomBytes(12).toString('hex');

    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 360000);

    await user.save();

    const resetUrl = `${req.headers.origin}/reset-password/${resetToken}`;

    if (user.email) {
        const emailService = new Email(user.name, `<h4>${resetUrl}</h4>`, user.email);
        await emailService.sendMail();
    }
});

export default forgotPasswordHandler;
