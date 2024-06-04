import { LoadingOutlined, MinusOutlined, PlusOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback, useMemo } from 'react';

import { addBookmark, removeBookmark } from '@/services/virtual-lab/bookmark';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';

type Props = {
  virtualLabId: string;
  projectId: string;
  resourceId: string;
};

export default function BookmarkButton({ virtualLabId, projectId, resourceId }: Props) {
  const bookmarks = useAtomValue(
    loadable(
      bookmarksForProjectAtomFamily({
        virtualLabId,
        projectId,
      })
    )
  );

  const refreshBookmarks = useSetAtom(bookmarksForProjectAtomFamily({ virtualLabId, projectId }));

  const saveToLibrary = useCallback(async () => {
    await addBookmark(virtualLabId, projectId, resourceId);
    refreshBookmarks();
  }, [virtualLabId, projectId, resourceId, refreshBookmarks]);

  const removeFromLibrary = useCallback(async () => {
    await removeBookmark(virtualLabId, projectId, resourceId);
    refreshBookmarks();
  }, [virtualLabId, projectId, resourceId, refreshBookmarks]);

  const isBookmarked = useMemo(() => {
    return bookmarks.state === 'hasData' && bookmarks.data.some((b) => b.resourceId === resourceId);
  }, [bookmarks, resourceId]);

  if (bookmarks.state === 'loading') {
    return <Spin className="border border-neutral-2 px-3 py-2" indicator={<LoadingOutlined />} />;
  }

  if (bookmarks.state === 'hasError') {
    return <WarningFilled title="Bookmark status could not be loaded" />;
  }

  return isBookmarked ? (
    <Button
      type="text"
      className="flex items-center gap-2 text-primary-7 hover:!bg-transparent"
      onClick={removeFromLibrary}
    >
      Remove from library
      <MinusOutlined className="border border-neutral-2 px-4 py-3" />
    </Button>
  ) : (
    <Button
      type="text"
      className="flex items-center gap-2 text-primary-7 hover:!bg-transparent"
      onClick={saveToLibrary}
    >
      Save to library
      <PlusOutlined className="border border-neutral-2 px-4 py-3" />
    </Button>
  );
}
