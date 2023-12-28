function getCookie(name: string) {
    try {
        const cookies = document?.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim());
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    } catch (err) {
        return null;
    }
}

export default getCookie;
