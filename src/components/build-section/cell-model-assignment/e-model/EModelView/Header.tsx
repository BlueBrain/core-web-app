import { ReactNode } from 'react';

export default function Header({ children }: { children: ReactNode }) {
  return <div className="text-2xl font-bold text-primary-8">{children}</div>;
}
