import { ReactNode } from 'react';

export type LayoutProps = {
  children: ReactNode;
  params: {
    virtualLabId: string;
    projectId: string;
  };
};
