export type BookmarkItem = {
  resourceId: string;
};

export async function addBookmark(resource: string, lab: string, labProject: string) {
  return getBookmarkedItems(lab, labProject).then((items) => {
    localStorage.setItem(
      keyFor(lab, labProject),
      JSON.stringify(items.concat({ resourceId: resource }))
    );
  });
}

const keyFor = (lab: string, project: string): string => `bookmarkedItems-${lab}-${project}`;

export async function getBookmarkedItems(lab: string, labProject: string): Promise<BookmarkItem[]> {
  const stringValue = localStorage.getItem(keyFor(lab, labProject));

  return Promise.resolve(stringValue ? (JSON.parse(stringValue) as BookmarkItem[]) : []);
}
