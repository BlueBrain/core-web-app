import { notification } from 'antd';
import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { Btn } from '@/components/Btn';
import { DataType } from '@/constants/explore-section/list-views';
import { bulkRemoveBookmarks } from '@/services/virtual-lab/bookmark';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';
import { ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { Bookmark } from '@/types/virtual-lab/bookmark';
import { useAccessToken } from '@/hooks/useAccessToken';

type Props = {
  selectedRows: ExploreESHit<ExploreResource>[];
  virtualLabId: string;
  projectId: string;
  category: DataType;
  clearSelectedRows: () => void;
};

export default function BookmarkFooter({
  selectedRows,
  virtualLabId,
  projectId,
  category,
  clearSelectedRows,
}: Props) {
  const refreshBookmarks = useSetAtom(bookmarksForProjectAtomFamily({ virtualLabId, projectId }));
  const token = useAccessToken()!;

  const notifySuccess = useCallback(() => {
    notification.success({
      message: 'Resources successfully removed from the library',
      duration: 5,
      placement: 'bottomRight',
    });
  }, []);

  const notifyError = useCallback(
    (failedBookmarks?: Bookmark[]) => {
      const failedResourceNames = failedBookmarks?.length
        ? selectedRows
            .filter((r) => failedBookmarks.some((b) => b.resourceId === r._source['@id']))
            .map((r) => r._source.name ?? r._source['@id'])
        : [];
      notification.error({
        message: failedBookmarks
          ? `Following resources could not be removed from the library`
          : 'There was an error when removing resources from the library',
        description: failedBookmarks?.length ? (
          <ul>
            {failedResourceNames.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : null,
        duration: 3,
        placement: 'bottomRight',
      });
    },
    [selectedRows]
  );

  const removeFromLibrary = async () => {
    try {
      const response = await bulkRemoveBookmarks(
        virtualLabId,
        projectId,
        selectedRows.map((r) => ({ category, resourceId: r._source['@id'] })),
        token
      );
      refreshBookmarks();
      if (response.failed_to_delete?.length > 0) {
        notifyError(response.failed_to_delete);
      } else {
        notifySuccess();
      }
    } catch (err) {
      notifyError();
    } finally {
      clearSelectedRows();
    }
  };

  return (
    <div className="absolute right-12 z-10 flex justify-end">
      <Btn
        className="fit-content sticky bottom-0 ml-2  w-fit animate-slide-up bg-primary-6"
        onClick={removeFromLibrary}
      >
        Remove from library
      </Btn>
      <Btn
        className="fit-content sticky bottom-0 ml-2 w-fit animate-[slide-up_1s] bg-primary-6 "
        style={{ animationDelay: '0.2s' }}
        onClick={() =>
          notification.info({ message: 'Coming soon', duration: 2, placement: 'bottomRight' })
        }
      >
        Use in build
      </Btn>
    </div>
  );
}
