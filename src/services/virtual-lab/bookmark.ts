import { createVLApiHeaders } from './common';
import { DataType } from '@/constants/explore-section/list-views';
import { virtualLabApi } from '@/config';
import { Bookmark, BookmarksByCategory } from '@/types/virtual-lab/bookmark';

export async function addBookmark(
  lab: string,
  labProject: string,
  bookmark: Bookmark,
  token: string = ''
) {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks`,
    {
      method: 'POST',
      headers: createVLApiHeaders(token),
      body: JSON.stringify(bookmark),
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function removeBookmark(
  lab: string,
  labProject: string,
  bookmark: Bookmark,
  token: string = ''
) {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks/${bookmark.resourceId}?category=${bookmark.category}`,
    {
      method: 'DELETE',
      headers: createVLApiHeaders(token),
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function getBookmarksByCategory(
  lab: string,
  labProject: string,
  token: string = ''
): Promise<BookmarksByCategory> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks`,
    {
      method: 'GET',
      headers: createVLApiHeaders(token),
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export const getBookmarksCount = (bookmarksByCategory: BookmarksByCategory): number => {
  return Object.keys(bookmarksByCategory).reduce(
    (acc, curr) => acc + bookmarksByCategory[curr as DataType].length,
    0
  );
};
