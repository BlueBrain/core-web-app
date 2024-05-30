import BookmarkList from '@/components/VirtualLab/Bookmarks/BookmarkList';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectLibraryPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;

  return <BookmarkList labId={virtualLabId} projectId={projectId} />;
}
