import prisma from "../db";

export async function findAllMonsterCardDrops() {
    return prisma.monsterCardDrop.findMany({
        select: {
            duelistName: true,
            dropChance: true,
            monster: {
                select: {
                    name: true,
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
                    description: true,
                },
            },
        },
        orderBy: { spell: { name: "asc" } },
    });
}