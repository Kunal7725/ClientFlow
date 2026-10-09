import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
    name: string;
    slug: string;
    logo: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}


const OrganizationSchema: Schema = new Schema<IOrganization>({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
    },

    logo: {
        type: String,
    },
},{
timestamps: true,
}
);

const Organization = mongoose.model<IOrganization>(
    "Organization",
    OrganizationSchema
);

export default Organization;