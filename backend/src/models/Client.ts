import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClient extends Document {
    organizationId: Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
    {
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
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        company: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

clientSchema.index({
    organizationId: 1,
    email: 1,
});

const Client = mongoose.model<IClient>("Client", clientSchema);

export default Client;