'use client';

import { MembersGroupIcon } from '../icons/MembersGroupIcon';

export default function VirtualLabLabel({ labName }: { labName: string }) {
  return (
    <div className="flex items-center">
      <MembersGroupIcon className="text-highlightPre" />
      <span className="ml-2 font-bold text-white">{labName}</span>
    </div>
  );
}
