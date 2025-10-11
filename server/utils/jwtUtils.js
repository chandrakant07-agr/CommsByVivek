import jwt from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export const jwtGenerateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

export const jwtGenerateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

// Example usage:
// const accessToken = generateAccessToken({ id: user._id });
// const refreshToken = generateRefreshToken({ id: user._id });
// const decodedAccess = verifyAccessToken(accessToken);
// const decodedRefresh = verifyRefreshToken(refreshToken);