import mongoose, { Document, Schema, Types } from "mongoose";

export enum UserRole {
    OWNER = "owner",
    CLIENT = "client",
    MANAGER = "manager",
    DEVELOPER = "developer",
}

export interface IUser extends Document {
    organizationId: Types.ObjectId;
    name: string;
    password: string;
    email: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

}

const userSchema = new Schema<IUser>({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.DEVELOPER,
    },

    avatar: {
        type: String,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
    }
);

userSchema.index(
    { organizationId: 1, email: 1 },
    { unique: true }
)

const User = mongoose.model<IUser>("User", userSchema);
export default User;
