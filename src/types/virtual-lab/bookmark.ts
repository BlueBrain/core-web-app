import { DataType } from '@/constants/explore-section/list-views';

export type Bookmark = {
  resourceId: string;
  category: DataType;
};

export type BookmarksByCategory = {
  [key in DataType]: Bookmark[];
};

export type BulkRemoveBookmarksResponse = {
  successfully_deleted: Bookmark[];
  failed_to_delete: Bookmark[];
};
