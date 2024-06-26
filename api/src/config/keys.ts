export const DATABASE = process.env.MONGO_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const PORT = process.env.PORT as string;
export const PEER_SERVER_PORT = parseInt(
  process.env.PEER_SERVER_PORT || "5000"
) as number;
export const COOKIE_KEY = process.env.COOKIE_KEY as string;
export const JWT_COOKIE_EXPIRES_IN = process.env
  .JWT_COOKIE_EXPIRES_IN as string;
export const COOKIE_EXPIRES_IN = process.env.COOKIE_EXPIRES_IN as string;
export const GOOGLE_OAUTH_CLIENT_ID = process.env
  .GOOGLE_OAUTH_CLIENT_ID as string;
export const GOOGLE_OAUTH_CLIENT_SECRET = process.env
  .GOOGLE_OAUTH_CLIENT_SECRET as string;
export const FACEBOOK_OAUTH_CLIENT_ID = process.env
  .FACEBOOK_OAUTH_CLIENT_ID as string;
export const FACEBOOK_OAUTH_CLIENT_SECRET = process.env
  .FACEBOOK_OAUTH_CLIENT_SECRET as string;
export const EMAIL_HOST = process.env.EMAIL_HOST as string;
export const EMAIL_HOST_PORT = parseInt(process.env.EMAIL_HOST_PORT as string);
export const EMAIL_AUTH_USER = process.env.EMAIL_AUTH_USER as string;
export const EMAIL_AUTH_PASSWORD = process.env.EMAIL_AUTH_PASSWORD as string;
export const EMAIL_HOST_TLS =
  process.env.EMAIL_HOST_TLS === "true" ? true : false;
export const CLIENT_URI = process.env.CLIENT_URI;
// more to come
