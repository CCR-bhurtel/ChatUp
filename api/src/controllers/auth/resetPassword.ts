import { NextFunction, Request, Response } from "express";
import User from "../../database/Model/User";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import createSendToken from "../../utils/createSendToken";
import { use } from "passport";

const resetPasswordHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetToken = req.query.token;

    if (!resetToken) {
      return next(new AppError("Please provide token", 403));
    }

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return new AppError("passwords donot match", 400);
    const user = await User.findOne({
      resetToken,
      resetTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return next(new AppError("Token invalid or already expired", 400));
    }

    user.password = password;
    user.resetTokenExpires = new Date();

    await user.save();
    createSendToken(user, res);
  }
);

export default resetPasswordHandler;
