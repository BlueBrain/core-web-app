import { render, screen } from '@testing-library/react';
import BookmarkList from '@/components/VirtualLab/Bookmarks/BookmarkList';

describe('Library', () => {
  const labId = '3';
  const projectId = '123';

  it('should render successfully', async () => {
    projectHasBookmarks(labId, projectId, ['item1', 'item2']);
    render(<BookmarkList labId={labId} projectId={projectId} />);

    await screen.findByText('item1');
    screen.getByText('item2');
  });
});

const projectHasBookmarks = (labId: string, projectId: string, items: string[]) => {
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
