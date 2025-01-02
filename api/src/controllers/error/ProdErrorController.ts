import { NextFunction, Request, Response } from "express";

import AppError, { ErrorType } from "../../lib/AppError";
import {
  ExtendedErrorCast,
  ExtendedErrorValidation,
  ExtendedErrorJWT,
  ExtendedErrorToken,
} from "./ErrorTypes";
import logger from "../../logger/winston.logger";

class ErrorController {
  private handleCastErroDB = (err: ExtendedErrorCast) => {
    const message: string = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  private handleDuplicateFieldDB = (err: ErrorType) => {
    return new AppError("The email already exists, please use another", 400);
  };
  private handleValidationErrorDB = (err: ExtendedErrorValidation) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data, ${errors[0]}`; // returning first validation error only
    return new AppError(message, 400);
  };
  private handleJWTError = (err: ExtendedErrorJWT) =>
    new AppError("Invalid Token, please login again", 401, "/login");

  private handleTokenExpireError = (err: ExtendedErrorToken) =>
    new AppError("Session Expired, please login again", 401, "/login");

  private sendProdError = (err: ErrorType, req: Request, res: Response) => {
    if (req.originalUrl.startsWith("/api")) {
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status || "error",
          message: err.message,
        });
      }

      logger.error(err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    } else {
      let msg = undefined;
      if (!err.isOperational) msg = "Please try again later";
      return res.status(err.statusCode).render("error", {
        title: "something went wrong",
        msg: msg || err.message,
      });
    }
  };

  public controller = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let error: AppError | null = null;
    if (err.name === "CastError" || err.kind === "ObjectId")
      error = this.handleCastErroDB(err as ExtendedErrorCast);
    if (err.code === 11000) error = this.handleDuplicateFieldDB(err);
    if (err.name === "ValidationError")
      error = this.handleValidationErrorDB(err as ExtendedErrorValidation);
    if (err.name === "JsonWebTokenError")
      error = this.handleJWTError(err as ExtendedErrorJWT);
    if (err.name === "TokenExpiredError")
      error = this.handleTokenExpireError(err as ExtendedErrorToken);

    this.sendProdError(error || err, req, res);
  };
}

export default ErrorController;
