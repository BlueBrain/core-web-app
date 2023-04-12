'use client';

import { useSession } from 'next-auth/react';
import InteractiveBrayns from '@/components/InteractiveBrayns';

export default function CellModelAssignmentView() {
  const { data: session } = useSession();
  return <InteractiveBrayns token={session?.accessToken} />;
}
