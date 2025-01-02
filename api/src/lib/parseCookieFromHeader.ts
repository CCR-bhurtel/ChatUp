export default function parseCookieFromHeader(cookieHeader?: string) {
  let authToken = "";
  if (cookieHeader) {
    const cookies = cookieHeader.split(";");

    cookies.forEach((cookie) => {
      if (cookie.trim().startsWith("Authorization")) {
        authToken = cookie.split("=")[1];
      }
    });
  }

  return authToken;
}
