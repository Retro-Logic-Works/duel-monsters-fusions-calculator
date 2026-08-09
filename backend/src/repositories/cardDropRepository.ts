import prisma from "../db";

export async function findAllMonsterCardDrops() {
    return prisma.monsterCardDrop.findMany({
        select: {
            duelistName: true,
            dropChance: true,
            monster: {
                select: {
                    name: true,
                    monsterNumber: true,
                    attackPoints: true,
                    defensePoints: true,
                    description: true,
                },
            },
        },
        orderBy: { monster: { name: "asc" } },
    });
}

export async function findAllMonsterVictoryBonuses() {
    return prisma.monsterVictoryBonus.findMany({
        select: {
            duelistName: true,
            winsRequired: true,
            monster: {
                select: {
                    name: true,
                    monsterNumber: true,
                    attackPoints: true,
                    defensePoints: true,
                    description: true,
                },
            },
        },
        orderBy: { monster: { name: "asc" } },
    });
}

export async function findAllSpellCardDrops() {
    return prisma.spellCardDrop.findMany({
        select: {
            duelistName: true,
            dropChance: true,
            spell: {
                select: {
                    name: true,
                    cardNumber: true,
                    description: true,
                },
            },
        },
        orderBy: { spell: { name: "asc" } },
    });
}

export async function findAllSpellVictoryBonuses() {
    return prisma.spellVictoryBonus.findMany({
        select: {
            duelistName: true,
            winsRequired: true,
            spell: {
                select: {
                    name: true,
                    cardNumber: true,
                    description: true,
                },
            },
        },
        orderBy: { spell: { name: "asc" } },
    });
}