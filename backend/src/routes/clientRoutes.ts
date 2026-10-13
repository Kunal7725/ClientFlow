
import { Router } from "express";
import {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
} from "../controllers/clientController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.patch("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
