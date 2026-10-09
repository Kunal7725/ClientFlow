export const getAuthConfig = () => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessTokenSecret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    if (!refreshTokenSecret) {
        throw new Error("JWT_REFRESH_SECRET is not configured");
    }

    return {
        accessTokenSecret,
        refreshTokenSecret,
        accessTokenExpiresIn:
            process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        refreshTokenExpiresIn:
            process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    };
};