import { Router } from "express";
import { syncUserController } from "../controllers/auth.controller";

const router = Router();

router.post("/sync", syncUserController);

export default router;
