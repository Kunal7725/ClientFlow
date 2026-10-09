import mongoose, { Document, Schema, Types } from "mongoose";

export enum ProjectStatus {
    PLANNING = "PLANNING",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface IProject extends Document {
    organizationId: Types.ObjectId;
    clientId: Types.ObjectId;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: Date;
    dueDate?: Date;
    budget?: number;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        clientId: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            required: true,
            index: true,
        },

        name: {
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
            enum: Object.values(ProjectStatus),
            default: ProjectStatus.PLANNING,
        },

        startDate: {
            type: Date,
        },

        dueDate: {
            type: Date,
        },

        budget: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

projectSchema.index({
    organizationId: 1,
    clientId: 1,
});

projectSchema.index({
    organizationId: 1,
    status: 1,
});

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;