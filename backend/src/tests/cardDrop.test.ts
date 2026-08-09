import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

type MonsterCardDrop = {
    cardName: string;
    monsterNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
    dropChance: number;
};

type MonsterVictoryBonus = {
    cardName: string;
    monsterNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
    winsRequired: number;
};

type SpellCardDrop = {
    cardName: string;
    cardNumber: number | null;
    description: string | null;
    dropChance: number;
};

type SpellVictoryBonus = {
    cardName: string;
    cardNumber: number | null;
    description: string | null;
    winsRequired: number;
};

type Duelist = {
    name: string;
    monsterCardDrops: MonsterCardDrop[];
    monsterVictoryBonuses: MonsterVictoryBonus[];
    spellCardDrops: SpellCardDrop[];
    spellVictoryBonuses: SpellVictoryBonus[];
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

    it("returns an object with a duelists array", async () => {
        const res = await request(app).get("/card-drops");
        expect(res.body).toHaveProperty("duelists");
        expect(res.body.duelists).toBeInstanceOf(Array);
    });

    it("returns at least one duelist", async () => {
        const res = await request(app).get("/card-drops");
        expect(res.body.duelists.length).toBeGreaterThan(0);
    });

    it("only returns duelists with recognized display names", async () => {
        const res = await request(app).get("/card-drops");

        res.body.duelists.forEach((duelist: Duelist) => {
            expect(validDuelistNames).toContain(duelist.name);
        });
    });

    it("gives each duelist all four category arrays", async () => {
        const res = await request(app).get("/card-drops");

        res.body.duelists.forEach((duelist: Duelist) => {
            expect(duelist.monsterCardDrops).toBeInstanceOf(Array);
            expect(duelist.monsterVictoryBonuses).toBeInstanceOf(Array);
            expect(duelist.spellCardDrops).toBeInstanceOf(Array);
            expect(duelist.spellVictoryBonuses).toBeInstanceOf(Array);
        });
    });

    it("omits duelists with no drops or bonuses at all", async () => {
        const res = await request(app).get("/card-drops");

        res.body.duelists.forEach((duelist: Duelist) => {
            const total =
                duelist.monsterCardDrops.length +
                duelist.monsterVictoryBonuses.length +
                duelist.spellCardDrops.length +
                duelist.spellVictoryBonuses.length;
            expect(total).toBeGreaterThan(0);
        });
    });

    it("includes at least one monster card drop somewhere in the response", async () => {
        const res = await request(app).get("/card-drops");

        const total = res.body.duelists.reduce(
            (sum: number, d: Duelist) => sum + d.monsterCardDrops.length,
            0
        );
        expect(total).toBeGreaterThan(0);
    });

    it("includes at least one spell card drop somewhere in the response", async () => {
        const res = await request(app).get("/card-drops");

        const total = res.body.duelists.reduce(
            (sum: number, d: Duelist) => sum + d.spellCardDrops.length,
            0
        );
        expect(total).toBeGreaterThan(0);
    });

    it("monster card drop entries have the expected fields", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            duelist.monsterCardDrops.forEach((drop) => {
                expect(typeof drop.cardName).toBe("string");
                expect(drop.cardName.length).toBeGreaterThan(0);
                expect(drop).toHaveProperty("monsterNumber");
                expect(drop).toHaveProperty("attackPoints");
                expect(drop).toHaveProperty("defensePoints");
                expect(drop).toHaveProperty("description");
                expect(typeof drop.dropChance).toBe("number");
            });
        }
    });

    it("monster victory bonus entries have the expected fields", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            duelist.monsterVictoryBonuses.forEach((bonus) => {
                expect(typeof bonus.cardName).toBe("string");
                expect(bonus.cardName.length).toBeGreaterThan(0);
                expect(bonus).toHaveProperty("monsterNumber");
                expect(bonus).toHaveProperty("attackPoints");
                expect(bonus).toHaveProperty("defensePoints");
                expect(bonus).toHaveProperty("description");
                expect(typeof bonus.winsRequired).toBe("number");
            });
        }
    });

    it("spell card drop entries have the expected fields", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            duelist.spellCardDrops.forEach((drop) => {
                expect(typeof drop.cardName).toBe("string");
                expect(drop.cardName.length).toBeGreaterThan(0);
                expect(drop).toHaveProperty("cardNumber");
                expect(drop).toHaveProperty("description");
                expect(typeof drop.dropChance).toBe("number");
            });
        }
    });

    it("spell victory bonus entries have the expected fields", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            duelist.spellVictoryBonuses.forEach((bonus) => {
                expect(typeof bonus.cardName).toBe("string");
                expect(bonus.cardName.length).toBeGreaterThan(0);
                expect(bonus).toHaveProperty("cardNumber");
                expect(bonus).toHaveProperty("description");
                expect(typeof bonus.winsRequired).toBe("number");
            });
        }
    });

    it("has non-negative ATK and DEF when present on monster entries", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            [...duelist.monsterCardDrops, ...duelist.monsterVictoryBonuses].forEach((entry) => {
                if (entry.attackPoints !== null) expect(entry.attackPoints).toBeGreaterThanOrEqual(0);
                if (entry.defensePoints !== null) expect(entry.defensePoints).toBeGreaterThanOrEqual(0);
            });
        }
    });

    it("has a drop chance between 0 and 100 for card drop entries", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            [...duelist.monsterCardDrops, ...duelist.spellCardDrops].forEach((entry) => {
                expect(entry.dropChance).toBeGreaterThan(0);
                expect(entry.dropChance).toBeLessThanOrEqual(100);
            });
        }
    });

    it("has a positive wins required for victory bonus entries", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            [...duelist.monsterVictoryBonuses, ...duelist.spellVictoryBonuses].forEach((entry) => {
                expect(entry.winsRequired).toBeGreaterThan(0);
            });
        }
    });

    it("does not include id, createdAt, or updatedAt anywhere in the response", async () => {
        const res = await request(app).get("/card-drops");

        for (const duelist of res.body.duelists as Duelist[]) {
            expect(duelist).not.toHaveProperty("id");
            const allEntries = [
                ...duelist.monsterCardDrops,
                ...duelist.monsterVictoryBonuses,
                ...duelist.spellCardDrops,
                ...duelist.spellVictoryBonuses,
            ];
            allEntries.forEach((entry) => {
                expect(entry).not.toHaveProperty("id");
                expect(entry).not.toHaveProperty("createdAt");
                expect(entry).not.toHaveProperty("updatedAt");
            });
        }
    });

    // Canary: this suite's requests carry no X-API-Key, so they all count against the
    // unauthenticated rate limit. Failing here means this file is approaching that limit
    // well before it would start actually tripping 429s.
    it("stays comfortably under the unauthenticated rate limit for this file", async () => {
        const res = await request(app).get("/card-drops");
        expect(Number(res.headers["ratelimit-remaining"])).toBeGreaterThan(50);
    });
});