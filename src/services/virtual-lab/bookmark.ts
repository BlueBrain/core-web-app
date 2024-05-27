export type BookmarkItem = {
  resourceId: string;
  projectLabel: string;
};

export async function addBookmark(
  resource: string,
  resourceProjectLabel: string,
  lab: string,
  labProject: string
) {
  console.log('Project', labProject);
  return getBookmarkedItems(lab, labProject).then((items) => {
    localStorage.setItem(
      keyFor(lab, labProject),
      JSON.stringify(items.concat({ resourceId: resource, projectLabel: resourceProjectLabel }))
    );
  });
}

const keyFor = (lab: string, project: string): string => `bookmarkedItems-${lab}-${project}`;

export async function getBookmarkedItems(lab: string, labProject: string): Promise<BookmarkItem[]> {
  const stringValue = localStorage.getItem(keyFor(lab, labProject));

  return Promise.resolve(stringValue ? (JSON.parse(stringValue) as BookmarkItem[]) : []);
}
