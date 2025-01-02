import { ErrorType } from "../../lib/AppError";
import { Error } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export type ExtendedErrorCast = ErrorType & Error.CastError;

export type ExtendedErrorValidation = ErrorType & Error.ValidationError;
export type ExtendedErrorJWT = ErrorType & JsonWebTokenError;
export type ExtendedErrorToken = ErrorType & TokenExpiredError;
