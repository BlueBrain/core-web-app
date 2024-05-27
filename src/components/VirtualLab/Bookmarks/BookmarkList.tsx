'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getBookmarkedItems, BookmarkItem } from '@/services/virtual-lab/bookmark';
import { detailUrlWithinLab } from '@/util/common';

type Props = {
  labId: string;
  projectId: string;
};

export default function BookmarkList({ labId, projectId }: Props) {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkItem[]>();

  useEffect(() => {
    getBookmarkedItems(labId, projectId).then((items) => setBookmarkedItems(items));
  }, [labId, projectId]);

  return (
    <div>
      <h4>Library</h4>
      {bookmarkedItems && (
        <ul>
          {bookmarkedItems.map((bookmark) => (
            <li key={bookmark.resourceId}>
              <Link
                href={detailUrlWithinLab(
                  labId,
                  projectId,
                  bookmark.projectLabel,
                  bookmark.resourceId,
                  'morphology'
                )}
              >
                {' '}
                {bookmark.resourceId}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
