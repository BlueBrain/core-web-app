'use client';

import { useParams } from 'next/navigation';

export default function InvitePage() {
  const params = useParams<{ errorcode: string }>();

  return <h1>{params.errorcode} Received</h1>;
}
