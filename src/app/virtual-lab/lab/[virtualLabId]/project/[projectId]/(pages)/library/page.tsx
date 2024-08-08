import BookmarkTabs from '@/components/VirtualLab/Bookmarks/BookmarkTabs';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectLibraryPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;

  return <BookmarkTabs labId={virtualLabId} projectId={projectId} />;
}
