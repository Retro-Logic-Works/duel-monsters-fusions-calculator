export interface MonsterCardDropEntryDTO {
    cardName: string;
    monsterNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
    dropChance: number;
}

export interface MonsterVictoryBonusEntryDTO {
    cardName: string;
    monsterNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    description: string | null;
    winsRequired: number;
}

export interface SpellCardDropEntryDTO {
    cardName: string;
    cardNumber: number | null;
    description: string | null;
    dropChance: number;
}

export interface SpellVictoryBonusEntryDTO {
    cardName: string;
    cardNumber: number | null;
    description: string | null;
    winsRequired: number;
}

export interface DuelistCardInfoDTO {
    name: string;
    monsterCardDrops: MonsterCardDropEntryDTO[];
    monsterVictoryBonuses: MonsterVictoryBonusEntryDTO[];
    spellCardDrops: SpellCardDropEntryDTO[];
    spellVictoryBonuses: SpellVictoryBonusEntryDTO[];
}

export interface CardDropsResponseDTO {
    duelists: DuelistCardInfoDTO[];
}