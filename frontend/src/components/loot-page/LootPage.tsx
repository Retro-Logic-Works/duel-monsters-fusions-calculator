import './LootPage.css'
import { useCardDrops } from "../../hooks/useCardDrops";
import type { DuelistCardInfoDTO } from "../../models/card-drops-dto";

interface DropRow {
    cardName: string;
    cardNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    dropChance: number;
}

interface BonusRow {
    cardName: string;
    cardNumber: number | null;
    attackPoints: number | null;
    defensePoints: number | null;
    winsRequired: number;
}

function getDropRows(duelist: DuelistCardInfoDTO): DropRow[] {
    const rows: DropRow[] = [
        ...duelist.monsterCardDrops.map((d) => ({
            cardName: d.cardName,
            cardNumber: d.monsterNumber,
            attackPoints: d.attackPoints,
            defensePoints: d.defensePoints,
            dropChance: d.dropChance,
        })),
        ...duelist.spellCardDrops.map((d) => ({
            cardName: d.cardName,
            cardNumber: d.cardNumber,
            attackPoints: null,
            defensePoints: null,
            dropChance: d.dropChance,
        })),
    ];

    return rows.sort((a, b) => b.dropChance - a.dropChance);
}

function getBonusRows(duelist: DuelistCardInfoDTO): BonusRow[] {
    const rows: BonusRow[] = [
        ...duelist.monsterVictoryBonuses.map((b) => ({
            cardName: b.cardName,
            cardNumber: b.monsterNumber,
            attackPoints: b.attackPoints,
            defensePoints: b.defensePoints,
            winsRequired: b.winsRequired,
        })),
        ...duelist.spellVictoryBonuses.map((b) => ({
            cardName: b.cardName,
            cardNumber: b.cardNumber,
            attackPoints: null,
            defensePoints: null,
            winsRequired: b.winsRequired,
        })),
    ];

    return rows.sort((a, b) => a.winsRequired - b.winsRequired);
}

export default function LootPage() {
    const { duelists, loading, error } = useCardDrops();

    return (
        <div className="loot-page" data-testid="loot-page">
            <div className="loot-hero">
                <h1 className="loot-title">Loot Table</h1>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Failed to load the loot table.</p>
            ) : duelists.length === 0 ? (
                <p>No loot data found.</p>
            ) : (
                <div className="duelist-list">
                    {duelists.map((duelist) => {
                        const dropRows = getDropRows(duelist);
                        const bonusRows = getBonusRows(duelist);

                        return (
                            <section key={duelist.name} className="duelist-section">
                                <h2 className="duelist-name">{duelist.name}</h2>
                                <div className="loot-table-group">
                                    <div className="loot-table-wrapper">
                                        <div className="loot-table-heading">Drop Table</div>
                                        {dropRows.length === 0 ? (
                                            <p className="loot-table-empty">No drops.</p>
                                        ) : (
                                            <table className="loot-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Card</th>
                                                        <th>ATK</th>
                                                        <th>DEF</th>
                                                        <th>Chance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dropRows.map((row, i) => (
                                                        <tr key={`${row.cardName}-${i}`}>
                                                            <td>{row.cardNumber ?? "?"}</td>
                                                            <td>{row.cardName}</td>
                                                            <td>{row.attackPoints ?? "-"}</td>
                                                            <td>{row.defensePoints ?? "-"}</td>
                                                            <td>{row.dropChance}%</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div className="loot-table-wrapper">
                                        <div className="loot-table-heading">Victory Bonus Table</div>
                                        {bonusRows.length === 0 ? (
                                            <p className="loot-table-empty">No victory bonuses.</p>
                                        ) : (
                                            <table className="loot-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Card</th>
                                                        <th>ATK</th>
                                                        <th>DEF</th>
                                                        <th>Wins</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bonusRows.map((row, i) => (
                                                        <tr key={`${row.cardName}-${i}`}>
                                                            <td>{row.cardNumber ?? "?"}</td>
                                                            <td>{row.cardName}</td>
                                                            <td>{row.attackPoints ?? "-"}</td>
                                                            <td>{row.defensePoints ?? "-"}</td>
                                                            <td>{row.winsRequired}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}