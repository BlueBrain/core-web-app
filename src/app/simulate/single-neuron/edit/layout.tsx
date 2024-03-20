'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SimulateSingleNeuronEditLayout({ children }: Props) {
  return <div>{children}</div>;
}
