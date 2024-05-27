import { render, screen } from '@testing-library/react';
import BookmarkList from '@/components/VirtualLab/Bookmarks/BookmarkList';
import { BookmarkItem } from '@/services/virtual-lab/bookmark';

const resourceProjectLabel = 'aLabel';

describe('Library', () => {
  const labId = '3';
  const projectId = '123';

  it('should render successfully', async () => {
    projectHasBookmarks(labId, projectId, [bookmarkItem('item1'), bookmarkItem('item2')]);
    render(<BookmarkList labId={labId} projectId={projectId} />);

    await screen.findByText('item1');
    screen.getByText('item2');
  });

  it('clicking on bookmark item navigates to item details page', async () => {
    projectHasBookmarks(labId, projectId, [bookmarkItem('item1'), bookmarkItem('item2')]);

    render(<BookmarkList labId={labId} projectId={projectId} />);

    const bookmarkLink: HTMLAnchorElement = await screen.findByText('item1');

    expect(bookmarkLink.href).toContain(labId);
    expect(bookmarkLink.href).toContain(projectId);
  });
});

const bookmarkItem = (id: string, projectLabel: string = resourceProjectLabel): BookmarkItem => ({
  resourceId: id,
  projectLabel,
});

const projectHasBookmarks = (labId: string, projectId: string, items: BookmarkItem[]) => {
  getBookmarkedItems.mockImplementation((aLab, aProject) => {
    if (labId === aLab && projectId === aProject) {
      return Promise.resolve(items);
    }
    return Promise.resolve([]);
  });
};

jest.mock('src/services/virtual-lab/bookmark', () => ({
  __esModule: true,
  getBookmarkedItems: (lab: string, project: string): string[] => {
    return getBookmarkedItems(lab, project);
  },
}));

const getBookmarkedItems = jest.fn();
