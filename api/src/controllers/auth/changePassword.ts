import User from '../../database/Model/User';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';

const changePasswordHandler = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword, newPasswordConfirm } = req.body;

    if (!user?.checkPassword(oldPassword)) {
        return next(new AppError('Your old password is incorrect', 400));
    }

    if (newPassword !== newPasswordConfirm) {
        return next(new AppError('Both password should match', 400));
    }

    user.password = newPassword;

    user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
});

export default changePasswordHandler;
