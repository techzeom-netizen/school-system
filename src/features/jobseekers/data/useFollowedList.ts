import { useMemo, useState } from 'react';
import {
  initialFollowed,
  type FollowedEntry,
  type FollowedCompany,
} from './followedCompanies';
import { companies } from './companies';

type UndoState = {
  entry: FollowedEntry;
  name: string;
} | null;

export const useFollowedList = () => {
  const [entries, setEntries] = useState<FollowedEntry[]>(initialFollowed);
  const [undo, setUndo] = useState<UndoState>(null);

  const entryIds = useMemo(
    () => new Set(entries.map(entry => entry.companyId)),
    [entries]
  );

  const unfollow = (id: string, name: string) => {
    setEntries(current => {
      const removed = current.find(entry => entry.companyId === id);
      if (removed) {
        setUndo({ entry: removed, name });
      }

      // TODO: replace with API call.
      return current.filter(entry => entry.companyId !== id);
    });
  };

  const follow = (id: string) => {
    if (entryIds.has(id) || !companies.some(company => company.id === id)) {
      return;
    }

    // TODO: replace with API call.
    setEntries(current => [
      { companyId: id, followedDaysAgo: 0, alertsOn: true },
      ...current,
    ]);
  };

  const toggleAlerts = (id: string) => {
    // TODO: replace with API call.
    setEntries(current =>
      current.map(entry =>
        entry.companyId === id ? { ...entry, alertsOn: !entry.alertsOn } : entry
      )
    );
  };

  const restore = () => {
    if (!undo) return;

    setEntries(current => {
      if (current.some(entry => entry.companyId === undo.entry.companyId)) {
        return current;
      }

      return [...current, undo.entry];
    });
    setUndo(null);
  };

  const dismissUndo = () => setUndo(null);

  return {
    entries,
    undo,
    unfollow,
    follow,
    toggleAlerts,
    restore,
    dismissUndo,
  };
};

export type UseFollowedListResult = ReturnType<typeof useFollowedList>;
export type { FollowedCompany };
