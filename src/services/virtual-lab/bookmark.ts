import { Bookmark, BookmarksByCategory } from '@/types/virtual-lab/bookmark';

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

const keyFor = (lab: string, project: string): string => `bookmarkedItems-${lab}-${project}`;

async function getBookmarkedItems(lab: string, labProject: string): Promise<Bookmark[]> {
  const stringValue = localStorage.getItem(keyFor(lab, labProject));

  return Promise.resolve(stringValue ? (JSON.parse(stringValue) as Bookmark[]) : []);
}

// Temporary function that returns bookmarks by experiment categories. This will soon be replaced by a server call.
export async function getBookmarksByCategory(
  lab: string,
  labProject: string
): Promise<BookmarksByCategory> {
  const stringValue = localStorage.getItem(keyFor(lab, labProject));

  if (stringValue) {
    const bookmarks = JSON.parse(stringValue) as Bookmark[];
    const bookmarksByCategory = bookmarks.reduce((acc, curr) => {
      if (curr.category in acc) {
        return { ...acc, [curr.category]: [...acc[curr.category], curr] };
      }

      return { ...acc, [curr.category]: [curr] };
    }, {} as BookmarksByCategory);

    return Promise.resolve(bookmarksByCategory);
  }

  return Promise.resolve({} as BookmarksByCategory);
}
