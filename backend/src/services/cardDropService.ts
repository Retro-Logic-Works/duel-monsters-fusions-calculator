import {
    findAllMonsterCardDrops,
    findAllMonsterVictoryBonuses,
    findAllSpellCardDrops,
    findAllSpellVictoryBonuses,
} from "../repositories/cardDropRepository";
import { duelistLabels } from "../utils/duelistLabels";
import type { Duelist } from "../generated/prisma/client";
import logger from "../logger";

export interface MonsterCardDropDTO {
    cardName: string;
    monsterNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
    dropChance: number;
}

export interface MonsterVictoryBonusDTO {
    cardName: string;
    monsterNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
    winsRequired: number;
}

export interface SpellCardDropDTO {
    cardName: string;
    cardNumber: number | null;
    description: string | null;
    dropChance: number;
}

export interface SpellVictoryBonusDTO {
    cardName: string;
    cardNumber: number | null;
    description: string | null;
    winsRequired: number;
}

export interface DuelistCardInfoDTO {
    name: string;
    monsterCardDrops: MonsterCardDropDTO[];
    monsterVictoryBonuses: MonsterVictoryBonusDTO[];
    spellCardDrops: SpellCardDropDTO[];
    spellVictoryBonuses: SpellVictoryBonusDTO[];
}

function createEmptyDuelistMap(): Map<Duelist, DuelistCardInfoDTO> {
    const duelists = new Map<Duelist, DuelistCardInfoDTO>();

    for (const duelistName of Object.keys(duelistLabels) as Duelist[]) {
        duelists.set(duelistName, {
            name: duelistLabels[duelistName],
            monsterCardDrops: [],
            monsterVictoryBonuses: [],
            spellCardDrops: [],
            spellVictoryBonuses: [],
        });
    }

    return duelists;
}

export async function getAllCardDrops(): Promise<{ duelists: DuelistCardInfoDTO[] }> {
    logger.info("Returning all card drops and victory bonuses from the DB.");

    const [monsterCardDrops, monsterVictoryBonuses, spellCardDrops, spellVictoryBonuses] = await Promise.all([
        findAllMonsterCardDrops(),
        findAllMonsterVictoryBonuses(),
        findAllSpellCardDrops(),
        findAllSpellVictoryBonuses(),
    ]);

    const duelists = createEmptyDuelistMap();

    for (const drop of monsterCardDrops) {
        duelists.get(drop.duelistName)!.monsterCardDrops.push({
            cardName: drop.monster.name,
            monsterNumber: drop.monster.monsterNumber,
            attackPoints: drop.monster.attackPoints,
            defensePoints: drop.monster.defensePoints,
            description: drop.monster.description,
            dropChance: drop.dropChance,
        });
    }

    for (const bonus of monsterVictoryBonuses) {
        duelists.get(bonus.duelistName)!.monsterVictoryBonuses.push({
            cardName: bonus.monster.name,
            monsterNumber: bonus.monster.monsterNumber,
            attackPoints: bonus.monster.attackPoints,
            defensePoints: bonus.monster.defensePoints,
            description: bonus.monster.description,
            winsRequired: bonus.winsRequired,
        });
    }

    for (const drop of spellCardDrops) {
        duelists.get(drop.duelistName)!.spellCardDrops.push({
            cardName: drop.spell.name,
            cardNumber: drop.spell.cardNumber,
            description: drop.spell.description,
            dropChance: drop.dropChance,
        });
    }

    for (const bonus of spellVictoryBonuses) {
        duelists.get(bonus.duelistName)!.spellVictoryBonuses.push({
            cardName: bonus.spell.name,
            cardNumber: bonus.spell.cardNumber,
            description: bonus.spell.description,
            winsRequired: bonus.winsRequired,
        });
    }

    const nonEmptyDuelists = Array.from(duelists.values()).filter(
        (duelist) =>
            duelist.monsterCardDrops.length > 0 ||
            duelist.monsterVictoryBonuses.length > 0 ||
            duelist.spellCardDrops.length > 0 ||
            duelist.spellVictoryBonuses.length > 0
    );

    logger.info(`Grouped card drop info for ${nonEmptyDuelists.length} duelist(s).`);

    return { duelists: nonEmptyDuelists };
}