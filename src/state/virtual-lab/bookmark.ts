import { atomFamily, atomWithRefresh } from 'jotai/utils';
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
    atomWithRefresh<Promise<BookmarksByCategory>>(async () => {
      return await getBookmarksByCategory(virtualLabId, projectId);
    }),
  isBookmarkAtomEqual
);
