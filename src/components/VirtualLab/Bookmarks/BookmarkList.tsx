'use client';

import { useEffect, useState } from 'react';
import { getBookmarkedItems } from '@/services/virtual-lab/bookmark';

type Props = {
  labId: string;
  projectId: string;
};

export default function BookmarkList({ labId, projectId }: Props) {
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>();
  console.log('Vlab', labId, projectId);

  useEffect(() => {
    getBookmarkedItems(labId, projectId).then((items) => setBookmarkedItems(items));
  }, [labId, projectId]);

  return (
    <div>
      <h4>Library</h4>
      {bookmarkedItems && (
        <ul>
          {bookmarkedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
