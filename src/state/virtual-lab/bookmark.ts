import { atomFamily, atomWithRefresh } from 'jotai/utils';
import { atom } from 'jotai';
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

export const isResourceBookmarkedAtom = (id: string, virtualLabId: string, projectId: string) =>
  atom(async (get) => {
    const bookmarks = await get(bookmarksForProjectAtomFamily({ virtualLabId, projectId }));
    return bookmarks.some((b) => b.resourceId === id);
  });
