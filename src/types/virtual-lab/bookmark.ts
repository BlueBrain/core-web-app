import { DataType } from '@/constants/explore-section/list-views';

export type Bookmark = {
  resourceId: string;
  category: DataType;
};

export type BookmarksByCategory = {
  [key in DataType]: Bookmark[];
};
