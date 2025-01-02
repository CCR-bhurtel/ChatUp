import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../../lib/AppError";

class ErrorController {
  controller = (
    err: ErrorType,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message,
        stack: err.stack,
        error: err,
      });
    }

    if (err.isOperational) {
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: err.message,
      });
    } else {
      return res.status(500).render("error", {
        title: "Something went wrong",
        msg: err.message,
      });
    }
  };
}

export default ErrorController;
