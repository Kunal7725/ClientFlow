import { Response } from "express";
import mongoose from "mongoose";
import Task, { TaskPriority, TaskStatus } from "../models/Task";
import Project from "../models/Project";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const isValidObjectId = (id: string | string[]): boolean => {
    if (Array.isArray(id)) return false;
    return mongoose.Types.ObjectId.isValid(id);
};

// CREATE TASK
export const createTask = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const organizationId = req.user?.organizationId;
        const {
            projectId,
            assignedTo,
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        if (!organizationId) {
            return res.status(401).json({
                success: false,
                message: "Organization not found in authentication token",
            });
        }

        if (!projectId || !isValidObjectId(projectId)) {
            return res.status(400).json({
                success: false,
                message: "A valid projectId is required",
            });
        }

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        if (
            status !== undefined &&
            !Object.values(TaskStatus).includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status",
            });
        }

        if (
            priority !== undefined &&
            !Object.values(TaskPriority).includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task priority",
            });
        }

        if (
            dueDate !== undefined &&
            dueDate !== null &&
            (typeof dueDate !== "string" ||
                Number.isNaN(Date.parse(dueDate)))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid dueDate. Use a valid date string",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            organizationId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in your organization",
            });
        }

        if (assignedTo !== undefined && assignedTo !== null && assignedTo !== "") {
            if (
                typeof assignedTo !== "string" ||
                !isValidObjectId(assignedTo)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid assignedTo user ID",
                });
            }

            const user = await User.findOne({
                _id: assignedTo,
                organizationId,
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Assigned user must belong to your organization",
                });
            }
        }

        const task = await Task.create({
            organizationId,
            projectId,
            assignedTo: assignedTo || undefined,
            title: title.trim(),
            description:
                typeof description === "string"
                    ? description.trim()
                    : undefined,
            status: status || TaskStatus.TODO,
            priority: priority || TaskPriority.MEDIUM,
            dueDate: dueDate || undefined,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        console.error("Create task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create task",
        });
    }
};

// GET ALL TASKS
export const getTasks = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            return res.status(401).json({
                success: false,
                message: "Organization not found in authentication token",
            });
        }

        const { projectId: _pId, status: _st, priority: _pr, assignedTo: _at } = req.query;
        const projectId = _pId ? String(_pId) : undefined;
        const status = _st ? String(_st) : undefined;
        const priority = _pr ? String(_pr) : undefined;
        const assignedTo = _at ? String(_at) : undefined;

        const filter: Record<string, unknown> = { organizationId };

        if (projectId) {
            if (
                typeof projectId !== "string" ||
                !isValidObjectId(projectId as string)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            filter.projectId = projectId;
        }

        if (status) {
            if (
                typeof status !== "string" ||
                !Object.values(TaskStatus).includes(status as TaskStatus)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task status",
                });
            }

            filter.status = status;
        }

        if (priority) {
            if (
                typeof priority !== "string" ||
                !Object.values(TaskPriority).includes(priority as TaskPriority)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task priority",
                });
            }

            filter.priority = priority;
        }

        if (assignedTo) {
            if (
                typeof assignedTo !== "string" ||
                !isValidObjectId(assignedTo as string)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid assignedTo user ID",
                });
            }

            filter.assignedTo = assignedTo as string;
        }

        const tasks = await Task.find(filter)
            .populate("projectId", "name status")
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        console.error("Get tasks error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
        });
    }
};

// GET ONE TASK
export const getTaskById = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const organizationId = req.user?.organizationId;
        const { id } = req.params;

        if (!organizationId) {
            return res.status(401).json({
                success: false,
                message: "Organization not found in authentication token",
            });
        }

        if (!id || !isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOne({
            _id: id,
            organizationId,
        })
            .populate("projectId", "name status")
            .populate("assignedTo", "name email");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Get task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch task",
        });
    }
};

// UPDATE TASK
export const updateTask = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const organizationId = req.user?.organizationId;
        const { id } = req.params;
        const {
            projectId,
            assignedTo,
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        if (!organizationId) {
            return res.status(401).json({
                success: false,
                message: "Organization not found in authentication token",
            });
        }

        if (!id || !isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOne({
            _id: id,
            organizationId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (projectId !== undefined) {
            if (
                typeof projectId !== "string" ||
                !isValidObjectId(projectId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            const project = await Project.findOne({
                _id: projectId,
                organizationId,
            });

            if (!project) {
                return res.status(400).json({
                    success: false,
                    message: "Project must belong to your organization",
                });
            }

            task.projectId = new mongoose.Types.ObjectId(projectId);
        }

        if (assignedTo !== undefined) {
            if (assignedTo === null || assignedTo === "") {
                task.assignedTo = undefined;
            } else {
                if (
                    typeof assignedTo !== "string" ||
                    !isValidObjectId(assignedTo)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid assignedTo user ID",
                    });
                }

                const user = await User.findOne({
                    _id: assignedTo,
                    organizationId,
                });

                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: "Assigned user must belong to your organization",
                    });
                }

                task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
            }
        }

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Task title cannot be empty",
                });
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            if (
                description !== null &&
                typeof description !== "string"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be a string or null",
                });
            }

            task.description =
                typeof description === "string"
                    ? description.trim()
                    : undefined;
        }

        if (status !== undefined) {
            if (
                typeof status !== "string" ||
                !Object.values(TaskStatus).includes(status as TaskStatus)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task status",
                });
            }

            task.status = status as TaskStatus;
        }

        if (priority !== undefined) {
            if (
                typeof priority !== "string" ||
                !Object.values(TaskPriority).includes(priority as TaskPriority)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task priority",
                });
            }

            task.priority = priority as TaskPriority;
        }

        if (dueDate !== undefined) {
            if (dueDate === null || dueDate === "") {
                task.dueDate = undefined;
            } else {
                if (
                    typeof dueDate !== "string" ||
                    Number.isNaN(Date.parse(dueDate))
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid dueDate. Use a valid date string",
                    });
                }

                task.dueDate = new Date(dueDate);
            }
        }

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    } catch (error) {
        console.error("Update task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update task",
        });
    }
};

// DELETE TASK
export const deleteTask = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const organizationId = req.user?.organizationId;
        const { id } = req.params;

        if (!organizationId) {
            return res.status(401).json({
                success: false,
                message: "Organization not found in authentication token",
            });
        }

        if (!id || !isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            organizationId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Delete task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete task",
        });
    }
};