
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { getAuthConfig } from "../config/auth";
import User from "../models/User";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        organizationId: string;
        role: string;
    };
}

interface TokenPayload {
    userId: string;
    organizationId: string;
    role: string;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
            return;
        }

        const token = authHeader.slice(7);
        const { accessTokenSecret } = getAuthConfig();

        const decoded = jwt.verify(
            token,
            accessTokenSecret
        ) as TokenPayload;

        if (
            !Types.ObjectId.isValid(decoded.userId) ||
            !Types.ObjectId.isValid(decoded.organizationId)
        ) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
            return;
        }

        const user = await User.findOne({
            _id: decoded.userId,
            organizationId: decoded.organizationId,
            isActive: true,
        }).select("_id organizationId role");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User account is not available",
            });
            return;
        }

        req.user = {
            userId: user._id.toString(),
            organizationId: user.organizationId.toString(),
            role: user.role,
        };

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};