import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { getAuthConfig } from "../config/auth.js";

interface TokenPayload {
    userId: string;
    organizationId: string;
    role: string;
}

export const generateAccessToken = (
    userId: Types.ObjectId,
    organizationId: Types.ObjectId,
    role: string
): string => {
    const { accessTokenSecret, accessTokenExpiresIn } =
        getAuthConfig();

    const payload: TokenPayload = {
        userId: userId.toString(),
        organizationId: organizationId.toString(),
        role,
    };

    return jwt.sign(payload, accessTokenSecret, {
        expiresIn:
            accessTokenExpiresIn as jwt.SignOptions["expiresIn"],
    });
};