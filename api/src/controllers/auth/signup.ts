import { NextFunction, Request, Response } from "express";
import User from "../../database/Model/User";
import createSendToken from "../../lib/createSendToken";
import catchAsync from "../../lib/catchAsync";
import AppError from "../../lib/AppError";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return next(new AppError("Please fill all fields", 400));
    }
    if (password.toString().length <= 7) {
      return next(
        new AppError("Length of password should be greater than 6", 400)
      );
    }
    const existingUser = await User.findOne({
      registerType: "emailPassword",
      email,
    });
    if (existingUser) {
      return next(
        new AppError(`Email ${email} already exists, please use another`, 400)
      );
    }
    const user = await User.create({
      name,
      email,
      password,
      registerType: "emailPassword",
      blockedUsers: [],
    });
    createSendToken(user, res);
  }
);

export default signup;
