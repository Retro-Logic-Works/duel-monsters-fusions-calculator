import { findAllMonsterCardDrops, findAllSpellCardDrops } from "../repositories/cardDropRepository";
import { duelistLabels } from "../utils/duelistLabels";
import logger from "../logger";

export interface CardDropDTO {
    cardType: "Monster" | "Spell";
    name: string;
    duelistName: string;
    dropChance: number;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
}

export async function getAllCardDrops(): Promise<CardDropDTO[]> {
    logger.info("Returning all card drops from the DB.");

    const [monsterDrops, spellDrops] = await Promise.all([
        findAllMonsterCardDrops(),
        findAllSpellCardDrops(),
    ]);

    const monsterCardDrops: CardDropDTO[] = monsterDrops.map((drop) => ({
        cardType: "Monster",
        name: drop.monster.name,
        duelistName: duelistLabels[drop.duelistName],
        dropChance: drop.dropChance,
        attackPoints: drop.monster.attackPoints,
        defensePoints: drop.monster.defensePoints,
        description: drop.monster.description,
    }));

    const spellCardDrops: CardDropDTO[] = spellDrops.map((drop) => ({
        cardType: "Spell",
        name: drop.spell.name,
        duelistName: duelistLabels[drop.duelistName],
        dropChance: drop.dropChance,
        attackPoints: null,
        defensePoints: null,
        description: drop.spell.description,
    }));

    const cardDrops = [...monsterCardDrops, ...spellCardDrops];
    logger.info(
        `Found ${cardDrops.length} card drop(s) (${monsterCardDrops.length} monster, ${spellCardDrops.length} spell).`
    );

    return cardDrops;
}