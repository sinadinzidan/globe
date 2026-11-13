import { fetchJson } from '@/api/fetchJson';
import { PLANTS_DATA_URL } from '@/constants/dashboard/plantConstants';
import type { Plant } from '@/types/dashboard/plantTypes';

export const fetchPlants = (signal?: AbortSignal) => fetchJson<Plant[]>(PLANTS_DATA_URL, signal);
