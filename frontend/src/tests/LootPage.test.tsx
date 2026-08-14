import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import LootPage from '../components/loot-page/LootPage';

vi.mock('../hooks/useCardDrops', () => ({
    useCardDrops: vi.fn(),
}));

import { useCardDrops } from '../hooks/useCardDrops';

const mockUseCardDrops = vi.mocked(useCardDrops);

describe('LootPage', () => {
    it('shows a loading state while fetching', () => {
        mockUseCardDrops.mockReturnValue({ duelists: [], loading: true, error: false });

        render(<LootPage />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows an error message when the fetch fails', () => {
        mockUseCardDrops.mockReturnValue({ duelists: [], loading: false, error: true });

        render(<LootPage />);

        expect(screen.getByText('Failed to load the loot table.')).toBeInTheDocument();
    });

    it('shows an empty state when there are no duelists', () => {
        mockUseCardDrops.mockReturnValue({ duelists: [], loading: false, error: false });

        render(<LootPage />);

        expect(screen.getByText('No loot data found.')).toBeInTheDocument();
    });

    it('renders a duelist section with drop table and victory bonus table entries', () => {
        mockUseCardDrops.mockReturnValue({
            loading: false,
            error: false,
            duelists: [
                {
                    name: 'Yugi Muto',
                    monsterCardDrops: [
                        { cardName: 'Curse of Dragon', monsterNumber: 39, attackPoints: 2000, defensePoints: 1500, description: null, dropChance: 4.5 },
                    ],
                    monsterVictoryBonuses: [
                        { cardName: 'Baby Dragon', monsterNumber: 38, attackPoints: 1200, defensePoints: 700, description: null, winsRequired: 90 },
                    ],
                    spellCardDrops: [
                        { cardName: 'Horn of the Unicorn', cardNumber: 314, description: null, dropChance: 2.1 },
                    ],
                    spellVictoryBonuses: [
                        { cardName: 'Dark-Piercing Light', cardNumber: 350, description: null, winsRequired: 20 },
                    ],
                },
            ],
        });

        render(<LootPage />);

        expect(screen.getByText('Yugi Muto')).toBeInTheDocument();
        expect(screen.getByText('Drop Table')).toBeInTheDocument();
        expect(screen.getByText('Victory Bonus Table')).toBeInTheDocument();

        // Monster + spell drops both appear in the combined drop table
        expect(screen.getByText('Curse of Dragon')).toBeInTheDocument();
        expect(screen.getByText('Horn of the Unicorn')).toBeInTheDocument();

        // Monster + spell victory bonuses both appear in the combined bonus table
        expect(screen.getByText('Baby Dragon')).toBeInTheDocument();
        expect(screen.getByText('Dark-Piercing Light')).toBeInTheDocument();
    });

    it('renders multiple duelist sections in the order returned by the API', () => {
        mockUseCardDrops.mockReturnValue({
            loading: false,
            error: false,
            duelists: [
                {
                    name: 'Yugi Muto',
                    monsterCardDrops: [],
                    monsterVictoryBonuses: [],
                    spellCardDrops: [],
                    spellVictoryBonuses: [],
                },
                {
                    name: 'Seto Kaiba',
                    monsterCardDrops: [],
                    monsterVictoryBonuses: [],
                    spellCardDrops: [],
                    spellVictoryBonuses: [],
                },
            ],
        });

        render(<LootPage />);

        const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
        expect(headings).toEqual(['Yugi Muto', 'Seto Kaiba']);
    });
});