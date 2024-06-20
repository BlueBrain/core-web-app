import {
  EyeOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { Button, Spin, notification } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { addBookmark, removeBookmark } from '@/services/virtual-lab/bookmark';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';
import {
  EXPERIMENT_DATA_TYPES,
  ExperimentTypeNames,
} from '@/constants/explore-section/data-types/experiment-data-types';
import { DataType } from '@/constants/explore-section/list-views';
import { useAccessToken } from '@/hooks/useAccessToken';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

type Props = {
  virtualLabId: string;
  projectId: string;
  resourceId: string;
  experimentType: ExperimentTypeNames;
};

export default function BookmarkButton({
  virtualLabId,
  projectId,
  resourceId,
  experimentType,
}: Props) {
  const token = useAccessToken()!;
  const bookmarks = useAtomValue(
    loadable(
      bookmarksForProjectAtomFamily({
        virtualLabId,
        projectId,
      })
    )
  );
  const router = useRouter();

  const refreshBookmarks = useSetAtom(bookmarksForProjectAtomFamily({ virtualLabId, projectId }));
  const libraryPage = `${generateVlProjectUrl(virtualLabId, projectId)}/library?category=${experimentType}`;

  const category = useMemo(() => {
    return Object.keys(EXPERIMENT_DATA_TYPES).find(
      (experimentKey) => EXPERIMENT_DATA_TYPES[experimentKey].name === experimentType
    )! as DataType;
  }, [experimentType]);

  const notifySuccess = useCallback(
    (action: 'add' | 'remove') => {
      if (action === 'add') {
        notification.success({
          message: 'Resource successfully added to the library',
          duration: 3,
          placement: 'bottomRight',
          description: <Button onClick={() => router.push(libraryPage)}>View in Library</Button>,
        });
      } else {
        notification.success({
          message: 'Resource successfully removed from the library',
          duration: 2,
          placement: 'bottomRight',
        });
      }
    },
    [router, libraryPage]
  );

  const notifyError = useCallback((action: 'add' | 'remove', err: any) => {
    if (action === 'add') {
      notification.error({
        message: 'Resource could not be added to the library',
        description: (err as Error)?.message ?? null,
        duration: 3,
        placement: 'bottomRight',
      });
    } else {
      notification.error({
        message: 'Resource could not be removed from the library',
        description: (err as Error)?.message ?? null,
        duration: 3,
        placement: 'bottomRight',
      });
    }
  }, []);

  const saveToLibrary = useCallback(async () => {
    try {
      await addBookmark(virtualLabId, projectId, { resourceId, category }, token);
      refreshBookmarks();
      notifySuccess('add');
    } catch (err) {
      notifyError('add', err);
    }
  }, [
    virtualLabId,
    projectId,
    resourceId,
    category,
    refreshBookmarks,
    notifySuccess,
    notifyError,
    token,
  ]);

  const removeFromLibrary = useCallback(async () => {
    try {
      await removeBookmark(virtualLabId, projectId, { resourceId, category }, token);
      refreshBookmarks();
      notifySuccess('remove');
    } catch (err) {
      notifyError('remove', err);
    }
  }, [
    virtualLabId,
    projectId,
    resourceId,
    category,
    refreshBookmarks,
    notifySuccess,
    notifyError,
    token,
  ]);

  const isBookmarked = useMemo(() => {
    return (
      bookmarks.state === 'hasData' &&
      bookmarks.data[category]?.some((b) => b.resourceId === resourceId)
    );
  }, [bookmarks, resourceId, category]);

  if (bookmarks.state === 'loading') {
    return <Spin className="border border-neutral-2 px-3 py-2" indicator={<LoadingOutlined />} />;
  }

  if (bookmarks.state === 'hasError') {
    return <WarningFilled title="Bookmark status could not be loaded" className="mr-2" />;
  }

  return isBookmarked ? (
    <>
      <Button
        type="text"
        className="mr-3 flex h-[36px] items-center gap-2 px-1 text-gray-500 hover:!bg-transparent"
        onClick={() => {
          router.push(libraryPage);
        }}
      >
        View in library
        <EyeOutlined />
      </Button>
      <Button
        type="text"
        className="mr-3 flex h-[36px] items-center gap-2 px-1 text-gray-500 hover:!bg-transparent"
        onClick={removeFromLibrary}
      >
        Remove from library
        <MinusCircleOutlined />
      </Button>
    </>
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
