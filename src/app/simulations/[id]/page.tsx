'use client';

import { usePathname } from 'next/navigation';

import Placeholder from '@/components/Placeholder';
import Theme from '@/styles/theme.module.css';

export default function Oservatory() {
  const path = usePathname();
  const parts = path?.split('/');
  if (!parts) return null;
  const id = parts[parts.length - 1];

  return <Placeholder className={Theme.colorPrimary}>{id}</Placeholder>;
}
