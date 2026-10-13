
import { Response, Router } from "express";
import {
    authenticate,
    AuthenticatedRequest,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
    "/me",
    authenticate,
    (req: AuthenticatedRequest, res: Response) => {
        res.status(200).json({
            success: true,
            message: "Authenticated user retrieved successfully",
            data: {
                user: req.user,
            },
        });
    }
);

export default router;