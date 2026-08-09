import "dotenv/config";
import express from "express";
import cors from "cors";
import monsterRouter from "./routes/monsterRoute";
import fusionRecipeRouter from "./routes/fusionRecipeRoute";
import cardDropRouter from "./routes/cardDropRoute";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { rateLimiter } from "./middleware/rateLimiter";

export const app = express();

// Render sits in front of this service as a single reverse proxy hop, forwarding the
// real client IP via X-Forwarded-For. Without this, req.ip (used by the rate limiter)
// would resolve to Render's proxy IP for every request instead of the actual client.
app.set("trust proxy", 1);

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : ["http://localhost:5173"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
}));
app.use(express.json());
app.use(apiKeyAuth);
app.use(rateLimiter);

app.get("/", (_req, res) => {
    res.json({ message: "Duel Monsters Fusion API is running." });
});

app.use("/monsters", monsterRouter);
app.use("/fusions", fusionRecipeRouter);
app.use("/card-drops", cardDropRouter);