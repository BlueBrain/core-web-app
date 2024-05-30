import { atomFamily, atomWithRefresh } from 'jotai/utils';
import isEqual from 'lodash/isEqual';
import { Bookmark } from '@/types/virtual-lab/bookmark';
import { getBookmarkedItems } from '@/services/virtual-lab/bookmark';

export type BookmarkScope = {
  virtualLabId: string;
  projectId: string;
};

export const bookmarksForProjectAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: BookmarkScope) =>
    atomWithRefresh<Promise<Bookmark[]>>(async () => {
      const response = await getBookmarkedItems(virtualLabId, projectId);
      return response;
    }),
  isEqual
);
