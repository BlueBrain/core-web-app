import { atomFamily, atomWithRefresh } from 'jotai/utils';
import { Bookmark } from '@/types/virtual-lab/bookmark';
import { getBookmarkedItems } from '@/services/virtual-lab/bookmark';

export type BookmarkScope = {
  virtualLabId: string;
  projectId: string;
};

const isBookmarkAtomEqual = (a: BookmarkScope, b: BookmarkScope): boolean =>
  a.virtualLabId === b.virtualLabId && a.projectId === b.projectId;

export const bookmarksForProjectAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: BookmarkScope) =>
    atomWithRefresh<Promise<Bookmark[]>>(async () => {
      const response = await getBookmarkedItems(virtualLabId, projectId);
      return response;
    }),
  isBookmarkAtomEqual
);
