import { Response } from "express";
import jwt from "jsonwebtoken";
import { PopulatedUser } from "../Types/User";
import { JWT_COOKIE_EXPIRES_IN, JWT_SECRET } from "../config/keys";
import logger from "../logger/winston.logger";
import { cookieConfiguration } from "../constants";

const createSendToken = (user: PopulatedUser, res: Response) => {
  try {
    const token: string = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_COOKIE_EXPIRES_IN,
    });
    const time: number = parseInt(JWT_COOKIE_EXPIRES_IN);

    res.cookie("Authorization", token, cookieConfiguration);
    return res.status(200).json({ ...user._doc, password: "", token });
  } catch (err) {
    logger.error("Error creating token", err);
    return res.status(400).json(err);
  }
};

export default createSendToken;
