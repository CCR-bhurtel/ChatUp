import { CookieOptions } from "express";
import { COOKIE_EXPIRES_IN, COOKIE_KEY } from "./config/keys";

export const cookieSessionConfiguration: CookieSessionInterfaces.CookieSessionOptions =
  {
    maxAge: parseInt(COOKIE_EXPIRES_IN) * 24 * 60 * 60,
    keys: [COOKIE_KEY],
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
  };

export const cookieConfiguration: CookieOptions = {
    maxAge: parseInt(COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };