import { captureException } from '@sentry/nextjs';
import { createVLApiHeaders } from './common';
import { DataType } from '@/constants/explore-section/list-views';
import { virtualLabApi } from '@/config';
import {
  Bookmark,
  BookmarksByCategory,
  BulkRemoveBookmarksResponse,
} from '@/types/virtual-lab/bookmark';
import { TypeDef, assertType } from '@/util/type-guards';

const optionalBookmarkArrayType: TypeDef = [
  '|',
  'undefined',
  ['array', { resourceId: 'string', category: 'string' }],
];

const bookmarksByCategoryType: TypeDef = {
  [DataType.ExperimentalBoutonDensity]: [...optionalBookmarkArrayType],
  [DataType.ExperimentalElectroPhysiology]: [...optionalBookmarkArrayType],
  [DataType.ExperimentalNeuronDensity]: [...optionalBookmarkArrayType],
  [DataType.ExperimentalNeuronMorphology]: [...optionalBookmarkArrayType],
  [DataType.ExperimentalSynapsePerConnection]: [...optionalBookmarkArrayType],
  [DataType.CircuitEModel]: [...optionalBookmarkArrayType],
  [DataType.SimulationCampaigns]: [...optionalBookmarkArrayType],
};

const bulkRemoveBookmarksExpectedType: TypeDef = {
  successfully_deleted: [...optionalBookmarkArrayType],
  failed_to_delete: [...optionalBookmarkArrayType],
};

const toBookmarksResponse = async <T>(
  response: Response,
  expectedType: TypeDef,
  defaultValue?: T
): Promise<T> => {
  try {
    const jsonResponse = await response.json();
    const data = jsonResponse?.data;
    assertType(data, expectedType);
    return data as T;
  } catch (err: any) {
    captureException('Received incompatible response from server', {
      extra: {
        expectedType,
        typeError: err,
      },
    });
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error('Received incompatible response from server');
  }
};

export async function addBookmark(
  lab: string,
  labProject: string,
  bookmark: Bookmark,
  token: string
) {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks`,
    {
      method: 'POST',
      headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark),
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return await toBookmarksResponse<Bookmark>(response, {
    resourceId: 'string',
    category: 'string',
  });
}

export async function removeBookmark(
  lab: string,
  labProject: string,
  bookmark: Bookmark,
  token: string
) {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks?resource_id=${encodeURIComponent(bookmark.resourceId)}&category=${bookmark.category}`,
    {
      method: 'DELETE',
      headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return await toBookmarksResponse(response, 'null', null);
}

export async function getBookmarksByCategory(
  lab: string,
  labProject: string,
  token: string
): Promise<BookmarksByCategory> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks`,
    {
      method: 'GET',
      headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return await toBookmarksResponse<BookmarksByCategory>(response, bookmarksByCategoryType);
}

export async function bulkRemoveBookmarks(
  lab: string,
  labProject: string,
  bookmarksToRemove: Bookmark[],
  token: string
): Promise<BulkRemoveBookmarksResponse> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${lab}/projects/${labProject}/bookmarks/bulk-delete`,
    {
      method: 'POST',
      headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmarksToRemove),
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return await toBookmarksResponse<BulkRemoveBookmarksResponse>(
    response,
    bulkRemoveBookmarksExpectedType
  );
}

export const getBookmarksCount = (bookmarksByCategory: BookmarksByCategory): number => {
  return Object.keys(bookmarksByCategory).reduce(
    (acc, curr) => acc + bookmarksByCategory[curr as DataType].length,
    0
  );
};
