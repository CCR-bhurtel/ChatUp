import { Request } from 'express';

const parseToken = (req: Request): string | null => {
    let authToken = null;

    const cookies: string[] | undefined = req.headers.cookie?.split(';');

    if (cookies) {
        cookies.forEach((cookie) => {
            if (cookie.trim().startsWith('Authorization')) {
                authToken = cookie.split('=')[1];
            }
        });
    }

    return authToken;
};

export default parseToken;
