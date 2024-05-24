'use client';

import { useEffect, useState } from 'react';
import { getBookmarkedItems } from '@/services/virtual-lab/bookmark';

export default function BookmarkList() {

  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>();

  useEffect(() => {
    console.log("useEffect")
    getBookmarkedItems('virtualLabId', 'projectId')
      .then(items => setBookmarkedItems(items))
  }, [])

  return <div>
    <h4>Library</h4>
    {bookmarkedItems && <ul>
      {bookmarkedItems.map(item => <li key={item}>{item}</li>)}
    </ul>}
  </div>;
}
