import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

type CardDrop = {
    cardType: "Monster" | "Spell";
    name: string;
    duelistName: string;
    dropChance: number;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
};

const validDuelistNames = [
    "Yugi Muto", "Tristan Taylor", "Joey Wheeler", "Ryou Bakura",
    "Weevil Underwood", "Rex Raptor", "Mako Tsunami", "Mai Valentine",
    "Seto Kaiba", "Mokuba Kaiba", "Puppeteer", "PaniK",
    "Bandit Keith", "Simon Muran", "Maximillion Pegasus", "Yami Yugi",
];

describe("GET /card-drops", () => {
    it("returns a 200 status", async () => {
        const res = await request(app).get("/card-drops");
        expect(res.status).toBe(200);
    });

    it("returns an array", async () => {
        const res = await request(app).get("/card-drops");
        expect(res.body).toBeInstanceOf(Array);
    });

    it("returns at least one card drop", async () => {
        const res = await request(app).get("/card-drops");
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("returns card drops with the expected fields", async () => {
        const res = await request(app).get("/card-drops");

        const drop = res.body[0];
        expect(drop).toHaveProperty("cardType");
        expect(drop).toHaveProperty("name");
        expect(drop).toHaveProperty("duelistName");
        expect(drop).toHaveProperty("dropChance");
        expect(drop).toHaveProperty("attackPoints");
        expect(drop).toHaveProperty("defensePoints");
        expect(drop).toHaveProperty("description");
    });

    it("includes both monster and spell card drops", async () => {
        const res = await request(app).get("/card-drops");

        const cardTypes = new Set(res.body.map((d: CardDrop) => d.cardType));
        expect(cardTypes.has("Monster")).toBe(true);
        expect(cardTypes.has("Spell")).toBe(true);
    });

    it("only returns Monster or Spell as the card type", async () => {
        const res = await request(app).get("/card-drops");

        res.body.forEach((drop: CardDrop) => {
            expect(["Monster", "Spell"]).toContain(drop.cardType);
        });
    });

    it("does not include attack or defense points for spell card drops", async () => {
        const res = await request(app).get("/card-drops");

        res.body
            .filter((drop: CardDrop) => drop.cardType === "Spell")
            .forEach((drop: CardDrop) => {
                expect(drop.attackPoints).toBeNull();
                expect(drop.defensePoints).toBeNull();
            });
    });

    it("has non-negative ATK and DEF when present on a monster card drop", async () => {
        const res = await request(app).get("/card-drops");

        res.body
            .filter((drop: CardDrop) => drop.cardType === "Monster")
            .forEach((drop: CardDrop) => {
                if (drop.attackPoints !== null) expect(drop.attackPoints).toBeGreaterThanOrEqual(0);
                if (drop.defensePoints !== null) expect(drop.defensePoints).toBeGreaterThanOrEqual(0);
            });
    });

    it("has a drop chance between 0 and 100", async () => {
        const res = await request(app).get("/card-drops");

        res.body.forEach((drop: CardDrop) => {
            expect(drop.dropChance).toBeGreaterThan(0);
            expect(drop.dropChance).toBeLessThanOrEqual(100);
        });
    });

    it("formats duelist names as display strings, not enum identifiers", async () => {
        const res = await request(app).get("/card-drops");

        res.body.forEach((drop: CardDrop) => {
            expect(validDuelistNames).toContain(drop.duelistName);
        });
    });

    it("has no card drop with a null or empty name", async () => {
        const res = await request(app).get("/card-drops");

        res.body.forEach((drop: CardDrop) => {
            expect(typeof drop.name).toBe("string");
            expect(drop.name.length).toBeGreaterThan(0);
        });
    });

    it("does not include id, createdAt, or updatedAt in the response", async () => {
        const res = await request(app).get("/card-drops");

        res.body.forEach((drop: object) => {
            expect(drop).not.toHaveProperty("id");
            expect(drop).not.toHaveProperty("createdAt");
            expect(drop).not.toHaveProperty("updatedAt");
        });
    });

    // Canary: this suite's requests carry no X-API-Key, so they all count against the
    // unauthenticated rate limit. Failing here means this file is approaching that limit
    // well before it would start actually tripping 429s.
    it("stays comfortably under the unauthenticated rate limit for this file", async () => {
        const res = await request(app).get("/card-drops");
        expect(Number(res.headers["ratelimit-remaining"])).toBeGreaterThan(50);
    });
});