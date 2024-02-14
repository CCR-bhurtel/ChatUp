import User from "../../database/Model/User";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";

const changePasswordHandler = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("user not found", 400));
  }
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  const isPasswordcorrect: boolean = await user.checkPassword(oldPassword);
  if (!isPasswordcorrect) {
    return next(new AppError("Your old password is incorrect", 401));
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError("Both password should match", 400));
  }

  if (newPassword.length <= 6) {
    return next(
      new AppError("Length of password should be greater than 6", 400)
    );
  }

  user.password = newPassword;

  await user.save();

  return res.status(200).json({ message: "Password changed successfully" });
});

export default changePasswordHandler;
