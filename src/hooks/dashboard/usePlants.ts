import { usePlantList } from '@/api/generated/plants/plants';

/** The plants the signed-in user may see. */
export const usePlants = () => usePlantList();
