import { useState, useEffect } from "react";
import type { CardDropsResponseDTO, DuelistCardInfoDTO } from "../models/card-drops-dto";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export function useCardDrops() {
    const [duelists, setDuelists] = useState<DuelistCardInfoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`${API_URL}/card-drops`, {
                    headers: { "X-API-Key": API_KEY },
                });
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
                const data: CardDropsResponseDTO = await res.json();
                if (!cancelled) {
                    setDuelists(data.duelists);
                }
            } catch (err) {
                console.error("Failed to fetch card drops", err);
                if (!cancelled) {
                    setError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return { duelists, loading, error };
}