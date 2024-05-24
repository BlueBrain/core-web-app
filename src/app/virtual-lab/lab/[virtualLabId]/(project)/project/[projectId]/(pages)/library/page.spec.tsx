import { render, screen } from '@testing-library/react';
import BookmarkList from '@/components/VirtualLab/BookmarkList';


describe('Library', () => {
  it('should render successfully', async () => {
    jest.mock('src/services/virtual-lab/bookmark', () => ({
      __esModule: true,
      getBookmarkedItems: (lab: string, project: string): string[] => {
        console.log("getBookmarkedItems.mockImplementation oher")
        return getBookmarkedItems(lab, project);
      },
    }));

    render(BookmarkList())

    await screen.findByText('item1');
    await screen.getByText('item2');
  });
})

const getBookmarkedItems = jest.fn((lab: string, project: string) => {
  if (lab === 'virtualLabId' && project === 'projectId') {
    console.log("getBookmarkedItems.mockImplementation correct")
    return ['item1', 'item2'];
  }
  console.log("getBookmarkedItems.mockImplementation wrong")
  return [];
});


