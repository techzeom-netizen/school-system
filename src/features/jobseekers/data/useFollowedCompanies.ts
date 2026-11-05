import { useCallback, useState } from 'react';

export const useFollowedCompanies = () => {
  const [following, setFollowing] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const toggle = useCallback((id: string) => {
    // TODO: call the follow/unfollow API.
    setFollowing(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { following, toggle };
};
