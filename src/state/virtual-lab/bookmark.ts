import { atomFamily, atomWithRefresh } from 'jotai/utils';

import sessionAtom from '../session';
import { BookmarksByCategory } from '@/types/virtual-lab/bookmark';
import { getBookmarksByCategory } from '@/services/virtual-lab/bookmark';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

const isVirtualLabInfoAtomEqual = (a: VirtualLabInfo, b: VirtualLabInfo): boolean =>
  a.virtualLabId === b.virtualLabId && a.projectId === b.projectId;

export const bookmarksForProjectAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: VirtualLabInfo) =>
    atomWithRefresh<Promise<BookmarksByCategory>>(async (get) => {
      const session = get(sessionAtom);
      if (!session) {
        return {} as BookmarksByCategory;
      }

      return await getBookmarksByCategory(virtualLabId, projectId, session.accessToken);
    }),
  isVirtualLabInfoAtomEqual
);
