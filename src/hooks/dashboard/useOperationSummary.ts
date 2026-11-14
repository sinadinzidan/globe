import { useOperationGetSummary } from '@/api/generated/operations/operations';

/** The state of operations by stream, across the sites the signed-in user can reach. */
export const useOperationSummary = () => useOperationGetSummary();
