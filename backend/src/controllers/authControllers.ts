import { Request, Response } from "express";
import Organization from "../models/Organization";
import User, { UserRole } from "../models/User";
import { hashPassword, comparePassword } from "../utils/passwoed";
import { generateAccessToken } from '../utils/token'

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            organizationName,
            name,
            email,
            password,
        } = req.body;

        if (!organizationName || !name || !email || !password) {
            res.status(400).json({
                success: false,
                message:
                    "Organization name, name, email and password are required",
            });

            return;
        }

        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });

            return;
        }

        const slug = organizationName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const existingOrganization = await Organization.findOne({
            slug,
        });

        if (existingOrganization) {
            res.status(409).json({
                success: false,
                message: "An organization with this name already exists",
            });

            return;
        }

        const hashedPassword = await hashPassword(password);

        const organization = await Organization.create({
            name: organizationName.trim(),
            slug,
            email: normalizedEmail,
        });

        const user = await User.create({
            organizationId: organization._id,
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: UserRole.OWNER,
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                organization: {
                    id: organization._id,
                    name: organization.name,
                    slug: organization.slug,
                },
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create account",
        });
    }
};


export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });

            return;
        }

        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Your account has been disabled",
            });

            return;
        }

        const passwordMatches = await comparePassword(
            password,
            user.password
        );

        if (!passwordMatches) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });

            return;
        }

        const accessToken = generateAccessToken(
            user._id,
            user.organizationId,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    organizationId: user.organizationId,
                },
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to login",
        });
    }
};