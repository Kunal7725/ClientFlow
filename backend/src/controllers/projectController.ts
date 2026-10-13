
import { Response } from "express";
import { Types } from "mongoose";
import Project, { ProjectStatus } from "../models/Project";
import Client from "../models/Client";
import Task from "../models/Task";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const createProject = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const {
            clientId,
            name,
            description,
            status,
            startDate,
            dueDate,
            budget,
        } = req.body;

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (
            typeof clientId !== "string" ||
            !Types.ObjectId.isValid(clientId)
        ) {
            res.status(400).json({
                success: false,
                message: "A valid client ID is required",
            });
            return;
        }

        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Project name is required",
            });
            return;
        }

        if (
            status !== undefined &&
            !Object.values(ProjectStatus).includes(status)
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid project status",
            });
            return;
        }

        if (
            budget !== undefined &&
            (typeof budget !== "number" ||
                !Number.isFinite(budget) ||
                budget < 0)
        ) {
            res.status(400).json({
                success: false,
                message: "Budget must be a non-negative number",
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

        const project = await Project.create({
            organizationId,
            clientId: client._id,
            name: name.trim(),
            description,
            status,
            startDate,
            dueDate,
            budget,
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: { project },
        });
    } catch (error) {
        console.error("Create project error:", error);

        res.status(400).json({
            success: false,
            message: "Could not create project. Check the supplied data.",
        });
    }
};

export const getProjects = async (
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

        const filter: Record<string, unknown> = { organizationId };

        if (req.query.clientId !== undefined) {
            const clientId = String(req.query.clientId);

            if (!Types.ObjectId.isValid(clientId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid client ID",
                });
                return;
            }

            filter.clientId = clientId;
        }

        const projects = await Project.find(filter)
            .populate("clientId", "name company email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: { projects },
        });
    } catch (error) {
        console.error("Get projects error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve projects",
        });
    }
};

export const getProjectById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const projectId = String(req.params.id);

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!Types.ObjectId.isValid(projectId)) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
            return;
        }

        const project = await Project.findOne({
            _id: projectId,
            organizationId,
        }).populate("clientId", "name company email");

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { project },
        });
    } catch (error) {
        console.error("Get project error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve project",
        });
    }
};

export const updateProject = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const projectId = String(req.params.id);

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!Types.ObjectId.isValid(projectId)) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
            return;
        }

        const allowedFields = [
            "name",
            "description",
            "status",
            "startDate",
            "dueDate",
            "budget",
        ] as const;

        const updates: Record<string, unknown> = {};

        for (const field of allowedFields) {
            if (req.body[field] === undefined) continue;

            const value = req.body[field];

            if (field === "name" || field === "description") {
                if (typeof value !== "string") {
                    res.status(400).json({
                        success: false,
                        message: `${field} must be a string`,
                    });
                    return;
                }

                if (field === "name" && !value.trim()) {
                    res.status(400).json({
                        success: false,
                        message: "Project name cannot be empty",
                    });
                    return;
                }

                updates[field] = value.trim();
            } else if (field === "status") {
                if (!Object.values(ProjectStatus).includes(value)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid project status",
                    });
                    return;
                }

                updates[field] = value;
            } else if (field === "budget") {
                if (
                    typeof value !== "number" ||
                    !Number.isFinite(value) ||
                    value < 0
                ) {
                    res.status(400).json({
                        success: false,
                        message: "Budget must be a non-negative number",
                    });
                    return;
                }

                updates[field] = value;
            } else {
                if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
                    res.status(400).json({
                        success: false,
                        message: `${field} must be a valid date`,
                    });
                    return;
                }

                updates[field] = new Date(value);
            }
        }

        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                success: false,
                message: "Provide at least one field to update",
            });
            return;
        }

        const project = await Project.findOneAndUpdate(
            { _id: projectId, organizationId },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("clientId", "name company email");

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: { project },
        });
    } catch (error) {
        console.error("Update project error:", error);

        res.status(400).json({
            success: false,
            message: "Could not update project. Check the supplied data.",
        });
    }
};

export const deleteProject = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        const projectId = String(req.params.id);

        if (!organizationId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!Types.ObjectId.isValid(projectId)) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
            return;
        }

        const project = await Project.findOne({
            _id: projectId,
            organizationId,
        });

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        const existingTask = await Task.findOne({
            projectId: project._id,
            organizationId,
        });

        if (existingTask) {
            res.status(409).json({
                success: false,
                message:
                    "This project has tasks. Remove or reassign its tasks before deleting it.",
            });
            return;
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};
