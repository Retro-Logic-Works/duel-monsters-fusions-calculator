import './AppHeader.css'
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AppHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="app-header">
            <div
                className="nav-dropdown"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
            >
                <span className="nav-dropdown-trigger">
                    Duel Monsters 1
                    <span className="nav-dropdown-caret">{menuOpen ? "▲" : "▼"}</span>
                </span>
                {menuOpen && (
                    <div className="nav-dropdown-menu">
                        <Link to="/" className="nav-dropdown-item" onClick={() => setMenuOpen(false)}>
                            Fusion Calculator
                        </Link>
                        <Link to="/loot" className="nav-dropdown-item" onClick={() => setMenuOpen(false)}>
                            Loot Table
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}