import { Request, Response } from "express";
import { getAllCardDrops } from "../services/cardDropService";
import logger from "../logger";

export async function getCardDropsController(_req: Request, res: Response) {
    try {
        const cardDrops = await getAllCardDrops();
        res.json(cardDrops);
    } catch (error) {
        logger.error("Failed to retrieve card drops", { error });
        res.status(500).json({ message: "Failed to retrieve card drops." });
    }
}