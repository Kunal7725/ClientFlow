import mongoose, { Document, Schema, Types } from "mongoose";

export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    COMPLETED = "COMPLETED",
}

export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export interface ITask extends Document {
    organizationId: Types.ObjectId;
    projectId: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.TODO,
        },

        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.MEDIUM,
        },

        dueDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({
    organizationId: 1,
    projectId: 1,
});

taskSchema.index({
    organizationId: 1,
    assignedTo: 1,
});

taskSchema.index({
    organizationId: 1,
    status: 1,
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;