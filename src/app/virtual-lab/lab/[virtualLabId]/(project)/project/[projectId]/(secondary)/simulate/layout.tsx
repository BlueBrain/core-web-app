'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SimulateSingleNeuronEditLayout({ children }: Props) {
  return <div className="h-screen w-screen bg-white">{children}</div>;
}
