import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

// Mock the hooks so tests don't make real API calls
vi.mock('../hooks/useFusionSearch', () => ({
    useFusionSearch: vi.fn(),
}));
vi.mock('../hooks/useCardDrops', () => ({
    useCardDrops: vi.fn(),
}));

import { useFusionSearch } from '../hooks/useFusionSearch';
import { useCardDrops } from '../hooks/useCardDrops';

const mockUseFusionSearch = vi.mocked(useFusionSearch);
const mockUseCardDrops = vi.mocked(useCardDrops);

async function openNavMenu() {
    const trigger = screen.getByText('Duel Monsters 1');
    fireEvent.mouseEnter(trigger.closest('.nav-dropdown')!);
    return screen.findByText('Loot Table');
}

describe('App routing', () => {
    beforeEach(() => {
        mockUseFusionSearch.mockReturnValue({ results: [], loading: false });
        mockUseCardDrops.mockReturnValue({ duelists: [], loading: false, error: false });
        window.history.pushState({}, '', '/');
    });

    it('renders the fusion calculator page at the root route', () => {
        render(<App />);

        expect(screen.getByPlaceholderText('Enter a monster name...')).toBeInTheDocument();
        expect(screen.queryByTestId('loot-page')).not.toBeInTheDocument();
    });

    it('navigates to the loot table page when selecting "Loot Table" from the dropdown', async () => {
        render(<App />);

        await openNavMenu();
        await userEvent.click(screen.getByText('Loot Table'));

        expect(screen.getByTestId('loot-page')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Enter a monster name...')).not.toBeInTheDocument();
        expect(window.location.pathname).toBe('/loot');
    });

    it('navigates back to the fusion calculator page when selecting "Fusion Calculator" from the loot table page', async () => {
        window.history.pushState({}, '', '/loot');
        render(<App />);

        const trigger = screen.getByText('Duel Monsters 1');
        fireEvent.mouseEnter(trigger.closest('.nav-dropdown')!);
        await userEvent.click(await screen.findByText('Fusion Calculator'));

        expect(screen.getByPlaceholderText('Enter a monster name...')).toBeInTheDocument();
        expect(screen.queryByTestId('loot-page')).not.toBeInTheDocument();
        expect(window.location.pathname).toBe('/');
    });

    it('closes the dropdown menu after selecting an option', async () => {
        render(<App />);

        await openNavMenu();
        await userEvent.click(screen.getByText('Loot Table'));

        expect(screen.queryByText('Fusion Calculator')).not.toBeInTheDocument();
    });
});