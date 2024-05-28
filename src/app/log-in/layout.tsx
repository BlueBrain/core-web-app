import { ReactNode } from 'react';

import NewEntryPoint from '@/components/NewEntryPoint';

export default function Layout({ children }: ReactNode) {
  return <NewEntryPoint>{children}</NewEntryPoint>;
}
