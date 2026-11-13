import { REQUEST_FAILED_MESSAGE } from '@/constants/queryConstants';

/** Loads a JSON document. The caller states the shape it expects. */
export const fetchJson = async <Result>(url: string, signal?: AbortSignal): Promise<Result> => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`${REQUEST_FAILED_MESSAGE} ${String(response.status)}`);
  }
  return (await response.json()) as Result;
};
