import { Response } from "express";
import { ExpressRequest } from "../../Types/User";
import User from "../../database/Model/User";
import AppError from "../../lib/AppError";
import catchAsync from "../../lib/catchAsync";
import fs from "fs";
import path from "path";
import logger from "../../logger/winston.logger";

export const profileImageUpload = catchAsync(
  async (req: ExpressRequest, res, next) => {
    const fileName = req.file?.filename;

    if (fileName) {
      try {
        if (
          req.user.profilePic &&
          !req.user.profilePic?.startsWith("defaultProfilePic")
        )
          await fs.unlinkSync(
            path.join(
              __dirname,
              "../../../public/images/userImages",
              req.user.profilePic
            )
          );
      } catch (err) {
        logger.error("Error deleting previous profile", err);
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          profilePic: fileName,
        },
        { new: true }
      );

      return res.status(200).json(user);
    } else {
      return next(new AppError("Couldn't save image", 400));
    }
  }
);

export const userProfileUpdate = catchAsync(
  async (req: ExpressRequest, res: Response, next) => {
    const { name, location, contactNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, location, contactNumber },
      { new: true }
    );

    return res.status(200).json(user);
  }
);

export const blockUser = catchAsync(
  async (req: ExpressRequest, res: Response, next) => {
    const { userid } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          blockedUsers: userid,
        },
      },
      { new: true }
    );

    return res.status(200).json(user);
  }
);

export const unblockUser = catchAsync(
  async (req: ExpressRequest, res: Response, next) => {
    const { userid } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          blockedUsers: userid,
        },
      },
      { new: true }
    );

    return res.status(200).json(user);
  }
);
