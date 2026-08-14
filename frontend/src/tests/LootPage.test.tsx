import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LootPage from '../components/loot-page/LootPage';

vi.mock('../hooks/useCardDrops', () => ({
    useCardDrops: vi.fn(),
}));

import { useCardDrops } from '../hooks/useCardDrops';

const mockUseCardDrops = vi.mocked(useCardDrops);

const yugi = {
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
};

const kaiba = {
    name: 'Seto Kaiba',
    monsterCardDrops: [
        { cardName: 'Blue-Eyes White Dragon', monsterNumber: 1, attackPoints: 3000, defensePoints: 2500, description: null, dropChance: 1 },
    ],
    monsterVictoryBonuses: [],
    spellCardDrops: [],
    spellVictoryBonuses: [],
};

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

    it('renders duelist headers collapsed by default, with a summary but no table content', () => {
        mockUseCardDrops.mockReturnValue({ loading: false, error: false, duelists: [yugi] });

        render(<LootPage />);

        expect(screen.getByText('Yugi Muto')).toBeInTheDocument();
        expect(screen.getByText('2 drops · 2 bonuses')).toBeInTheDocument();

        expect(screen.queryByText('Drop Table')).not.toBeInTheDocument();
        expect(screen.queryByText('Victory Bonus Table')).not.toBeInTheDocument();
        expect(screen.queryByText('Curse of Dragon')).not.toBeInTheDocument();
    });

    it('expands a duelist to show its drop and victory bonus tables when clicked', async () => {
        mockUseCardDrops.mockReturnValue({ loading: false, error: false, duelists: [yugi] });

        render(<LootPage />);

        await userEvent.click(screen.getByRole('button', { name: /Yugi Muto/ }));

        expect(screen.getByText('Drop Table')).toBeInTheDocument();
        expect(screen.getByText('Victory Bonus Table')).toBeInTheDocument();

        // Monster + spell drops both appear in the combined drop table
        expect(screen.getByText('Curse of Dragon')).toBeInTheDocument();
        expect(screen.getByText('Horn of the Unicorn')).toBeInTheDocument();

        // Monster + spell victory bonuses both appear in the combined bonus table
        expect(screen.getByText('Baby Dragon')).toBeInTheDocument();
        expect(screen.getByText('Dark-Piercing Light')).toBeInTheDocument();
    });

    it('collapses an expanded duelist when its header is clicked again', async () => {
        mockUseCardDrops.mockReturnValue({ loading: false, error: false, duelists: [yugi] });

        render(<LootPage />);

        const header = screen.getByRole('button', { name: /Yugi Muto/ });
        await userEvent.click(header);
        expect(screen.getByText('Drop Table')).toBeInTheDocument();

        await userEvent.click(header);
        expect(screen.queryByText('Drop Table')).not.toBeInTheDocument();
    });

    it('only keeps one duelist expanded at a time', async () => {
        mockUseCardDrops.mockReturnValue({ loading: false, error: false, duelists: [yugi, kaiba] });

        render(<LootPage />);

        await userEvent.click(screen.getByRole('button', { name: /Yugi Muto/ }));
        expect(screen.getByText('Curse of Dragon')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /Seto Kaiba/ }));
        expect(screen.queryByText('Curse of Dragon')).not.toBeInTheDocument();
        expect(screen.getByText('Blue-Eyes White Dragon')).toBeInTheDocument();
    });

    it('renders multiple duelist headers in the order returned by the API', () => {
        mockUseCardDrops.mockReturnValue({ loading: false, error: false, duelists: [yugi, kaiba] });

        render(<LootPage />);

        const headers = screen.getAllByRole('button').map((b) => b.textContent);
        expect(headers[0]).toContain('Yugi Muto');
        expect(headers[1]).toContain('Seto Kaiba');
    });
});