import { Router } from "express";
import { getCardDropsController } from "../controllers/cardDropController";

const router = Router();

router.get("/", getCardDropsController);

export default router;