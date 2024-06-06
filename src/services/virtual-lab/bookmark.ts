import { DataType } from '@/constants/explore-section/list-views';
import {
  Bookmark,
  BookmarksByCategory,
  BulkRemoveBookmarksResponse,
} from '@/types/virtual-lab/bookmark';

export async function addBookmark(lab: string, labProject: string, bookmark: Bookmark) {
  return getBookmarkedItems(lab, labProject).then((items) => {
    localStorage.setItem(keyFor(lab, labProject), JSON.stringify(items.concat(bookmark)));
  });
}

export async function removeBookmark(lab: string, labProject: string, bookmark: Bookmark) {
  return getBookmarkedItems(lab, labProject).then((items) => {
    localStorage.setItem(
      keyFor(lab, labProject),
      JSON.stringify(
        items.filter(
          (i) => i.resourceId !== bookmark.resourceId && i.category !== bookmark.category
        )
      )
    );
  });
}

// Temporary function to be replaced by REST api
export async function bulkRemoveBookmarks(
  lab: string,
  labProject: string,
  bookmarksToRemove: Bookmark[]
): Promise<BulkRemoveBookmarksResponse> {
  const bookmarks = await getBookmarkedItems(lab, labProject).then((items) => {
    localStorage.setItem(
      keyFor(lab, labProject),
      JSON.stringify(
        items.filter(
          (i) =>
            !bookmarksToRemove.some(
              (b) => b.category === i.category && b.resourceId === i.resourceId
            )
        )
      )
    );
    return items;
  });
  return { successfully_deleted: bookmarks, failed_to_delete: [] };
}

const keyFor = (lab: string, project: string): string => `bookmarkedItems-${lab}-${project}`;

async function getBookmarkedItems(lab: string, labProject: string): Promise<Bookmark[]> {
  const stringValue = localStorage.getItem(keyFor(lab, labProject));

  if (!stringValue) {
    return [];
  }

  try {
    const items = JSON.parse(stringValue) as any[];
    return items.map((i) => ({ resourceId: i.resourceId, category: i.category }) as Bookmark);
  } catch (err) {
    return [];
  }
}

// Temporary function that returns bookmarks by experiment categories. This will soon be replaced by a server call.
export async function getBookmarksByCategory(
  lab: string,
  labProject: string
): Promise<BookmarksByCategory> {
  const bookmarks = await getBookmarkedItems(lab, labProject);

  const bookmarksByCategory = bookmarks.reduce((acc, curr) => {
    if (curr.category in acc) {
      return { ...acc, [curr.category]: [...acc[curr.category], curr] };
    }

    return { ...acc, [curr.category]: [curr] };
  }, {} as BookmarksByCategory);

  return bookmarksByCategory;
}

export const getBookmarksCount = (bookmarksByCategory: BookmarksByCategory): number => {
  return Object.keys(bookmarksByCategory).reduce(
    (acc, curr) => acc + bookmarksByCategory[curr as DataType].length,
    0
  );
};
