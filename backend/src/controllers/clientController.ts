
import { Response } from "express";
import { Types } from "mongoose";
import Client from "../models/Client";
import Project from "../models/Project";
import {
    AuthenticatedRequest,
} from "../middleware/authMiddleware";

export const createClient = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const { name, email, phone, company, notes } = req.body;

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Client name is required",
            });
            return;
        }

        const client = await Client.create({
            organizationId,
            name: name.trim(),
            email:
                typeof email === "string"
                    ? email.trim().toLowerCase()
                    : undefined,
            phone:
                typeof phone === "string"
                    ? phone.trim()
                    : undefined,
            company:
                typeof company === "string"
                    ? company.trim()
                    : undefined,
            notes:
                typeof notes === "string"
                    ? notes.trim()
                    : undefined,
        });

        res.status(201).json({
            success: true,
            message: "Client created successfully",
            data: { client },
        });
    } catch (error) {
        console.error("Create client error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create client",
        });
    }
};

export const getClients = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const clients = await Client.find({ organizationId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: clients.length,
            data: { clients },
        });
    } catch (error) {
        console.error("Get clients error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve clients",
        });
    }
};

export const getClientById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const clientId = String(req.params.id);

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!Types.ObjectId.isValid(clientId)) {
            res.status(400).json({
                success: false,
                message: "Invalid client ID",
            });
            return;
        }

        const client = await Client.findOne({
            _id: clientId,
            organizationId,
        });

        if (!client) {
            res.status(404).json({
                success: false,
                message: "Client not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { client },
        });
    } catch (error) {
        console.error("Get client error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve client",
        });
    }
};

export const updateClient = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const clientId = String(req.params.id);

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!Types.ObjectId.isValid(clientId)) {
            res.status(400).json({
                success: false,
                message: "Invalid client ID",
            });
            return;
        }

        const allowedFields = [
            "name",
            "email",
            "phone",
            "company",
            "notes",
        ] as const;

        const updates: Record<string, string> = {};

        for (const field of allowedFields) {
            if (req.body[field] === undefined) {
                continue;
            }

            if (typeof req.body[field] !== "string") {
                res.status(400).json({
                    success: false,
                    message: `${field} must be a string`,
                });
                return;
            }

            const value = req.body[field].trim();

            if (field === "name" && !value) {
                res.status(400).json({
                    success: false,
                    message: "Client name cannot be empty",
                });
                return;
            }

            if (field === "email" && value) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide a valid email",
                    });
                    return;
                }

                updates[field] = value.toLowerCase();
            } else {
                updates[field] = value;
            }
        }

        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                success: false,
                message: "Provide at least one valid field to update",
            });
            return;
        }

        const client = await Client.findOneAndUpdate(
            { _id: clientId, organizationId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!client) {
            res.status(404).json({
                success: false,
                message: "Client not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Client updated successfully",
            data: { client },
        });
    } catch (error) {
        console.error("Update client error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update client",
        });
    }
};

export const deleteClient = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const clientId = String(req.params.id);

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!Types.ObjectId.isValid(clientId)) {
            res.status(400).json({
                success: false,
                message: "Invalid client ID",
            });
            return;
        }

        const client = await Client.findOne({
            _id: clientId,
            organizationId,
        });

        if (!client) {
            res.status(404).json({
                success: false,
                message: "Client not found",
            });
            return;
        }

        const existingProject = await Project.findOne({
            clientId: client._id,
            organizationId,
        });

        if (existingProject) {
            res.status(409).json({
                success: false,
                message:
                    "This client has projects. Remove or reassign the projects before deleting the client.",
            });
            return;
        }

        await client.deleteOne();

        res.status(200).json({
            success: true,
            message: "Client deleted successfully",
        });
    } catch (error) {
        console.error("Delete client error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete client",
        });
    }
};
