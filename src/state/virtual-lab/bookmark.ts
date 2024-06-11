import { atomFamily, atomWithRefresh } from 'jotai/utils';

import sessionAtom from '../session';
import { BookmarksByCategory } from '@/types/virtual-lab/bookmark';
import { getBookmarksByCategory } from '@/services/virtual-lab/bookmark';

export type BookmarkScope = {
  virtualLabId: string;
  projectId: string;
};

const isBookmarkAtomEqual = (a: BookmarkScope, b: BookmarkScope): boolean =>
  a.virtualLabId === b.virtualLabId && a.projectId === b.projectId;

export const bookmarksForProjectAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: BookmarkScope) =>
    atomWithRefresh<Promise<BookmarksByCategory>>(async (get) => {
      const session = get(sessionAtom);
      if (!session) {
        return {} as BookmarksByCategory;
      }

      return await getBookmarksByCategory(virtualLabId, projectId, session.accessToken);
    }),
  isBookmarkAtomEqual
);
