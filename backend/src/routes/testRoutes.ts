import { Router } from "express";
import Organization from "../models/Organization";
import User, { UserRole } from "../models/User";

const router = Router();

router.post("/create-test-data", async (_req, res) => {
    try {
        const organization = await Organization.create({
            name: "ClientFlow Demo Agency",
            slug: `clientflow-demo-${Date.now()}`,
            email: "demo@clientflow.com",
        });

        const user = await User.create({
            organizationId: organization._id,
            name: "Demo Owner",
            email: `owner-${Date.now()}@clientflow.com`,
            password: "temporary-password",
            role: UserRole.OWNER,
        });

        res.status(201).json({
            success: true,
            message: "Test organization and user created",
            data: {
                organization,
                user,
            },
        });
    } catch (error) {
        console.error("Test data creation failed:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create test data",
        });
    }
});

export default router;