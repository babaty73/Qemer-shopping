import { useEffect, useState } from "react";

/**
 * Tracks the current page number for a paginated list, automatically
 * resetting to page 1 whenever any value in `resetDeps` changes (e.g. a
 * status filter or search term) — so changing a filter never leaves the
 * view stuck on a page number that may no longer exist for the new results.
 */
export function usePageNumber(resetDeps: unknown[]): [number, (page: number) => void] {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  return [page, setPage];
}
