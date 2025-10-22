const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "Strict": Highest security, "Lax": Default for most cases, or "None": No restriction with Secure
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
};


const sessionCookieOptions = {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000    // 30 days
};

const clearCookieOptions = {
    ...cookieOptions,
    maxAge: 0
};

export { sessionCookieOptions, clearCookieOptions };