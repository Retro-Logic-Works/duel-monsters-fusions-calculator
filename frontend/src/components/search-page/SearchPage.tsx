import './SearchPage.css'
import { useState } from "react";
import { useFusionSearch } from "../../hooks/useFusionSearch";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const { results, loading } = useFusionSearch(query);

    return (
        <div className="search-page">
            <div className="search-hero">
                <h1 className="search-title">Fusion Calculator</h1>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Enter a monster name..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setExpandedRow(null);
                    }}
                />
            </div>
            {query && (
                <div className="search-results">
                    {loading ? (
                        <p>Loading...</p>
                    ) : results.length === 0 ? (
                        <p>No fusion recipes found.</p>
                    ) : (
                        <table className="card-table">
                            <thead>
                                <tr>
                                    <th>Material 1</th>
                                    <th>Material 2</th>
                                    <th>Fusion Monster</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <>
                                        <tr onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                                            <td>{row.materials[0]?.name}</td>
                                            <td>{row.materials[1]?.name}</td>
                                            <td>
                                                {row.fusionResult.name}
                                                <span className="expand-btn">
                                                    {expandedRow === index ? "▼" : "▶"}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedRow === index && (
                                            <tr>
                                                <td colSpan={3}>
                                                    <div className="expanded-details">
                                                        {[row.materials[0], row.materials[1]].map((mat, i) => (
                                                            <>
                                                                <div key={i} className="monster-card">
                                                                    {mat?.imageUrl && <img className="monster-card-img" src={mat.imageUrl} alt={mat.name} />}
                                                                    <div className="monster-card-number-and-name">#{mat?.monsterNumber} {mat?.name}</div>
                                                                    <div className="monster-card-stats">ATK: {mat?.attackPoints ?? "?"} / DEF: {mat?.defensePoints ?? "?"}</div>
                                                                    <div className="monster-card-desc">{mat?.description}</div>
                                                                    {mat?.monsterCardDrops.length > 0 && <div className="monster-card-drop-header">Drops from:</div>}
                                                                    
                                                                    {mat?.monsterCardDrops.map((drop) => (
                                                                        <div key={drop.duelistName} className="monster-card-drop">
                                                                            {drop.duelistName} ({drop.dropChance}%)
                                                                        </div>
                                                                    ))}

                                                                    {mat?.monsterVictoryBonuses.length > 0 && <div className="monster-card-victory-bonus-header">Victory bonus from:</div>}

                                                                    {mat?.monsterVictoryBonuses.map((bonus) => (
                                                                        <div key={bonus.duelistName} className="monster-card-victory-bonus">
                                                                            {bonus.duelistName} | Wins: {bonus.winsRequired}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {i === 0 && <div className="fusion-symbol">+</div>}
                                                            </>
                                                        ))}
                                                        <div className="fusion-symbol">→</div>
                                                        <div className="monster-card monster-card--result">
                                                            {row.fusionResult.imageUrl && <img className="monster-card-img" src={row.fusionResult.imageUrl} alt={row.fusionResult.name} />}
                                                            <div className="monster-card-number-and-name">#{row?.fusionResult.monsterNumber} {row.fusionResult.name}</div>
                                                            <div className="monster-card-stats">ATK: {row.fusionResult.attackPoints ?? "?"} / DEF: {row.fusionResult.defensePoints ?? "?"}</div>
                                                            <div className="monster-card-desc">{row.fusionResult.description}</div>
                                                            {row.fusionResult.monsterCardDrops.length > 0 && <div className="monster-card-drop-header">Drops from:</div>}

                                                            {row.fusionResult?.monsterCardDrops.map((drop) => (
                                                                <div key={drop.duelistName} className="monster-card-drop">
                                                                    {drop.duelistName} ({drop.dropChance}%)
                                                                </div>
                                                            ))}

                                                            {row.fusionResult?.monsterVictoryBonuses.length > 0 && <div className="monster-card-victory-bonus-header">Victory bonus from:</div>}
                                                            {row.fusionResult?.monsterVictoryBonuses.map((bonus) => (
                                                                <div key={bonus.duelistName} className="monster-card-victory-bonus">
                                                                    {bonus.duelistName} | Wins: {bonus.winsRequired}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}