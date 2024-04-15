import { ReactNode } from 'react';

export type LabProjectLayoutProps = {
  children: ReactNode;
  params: {
    virtualLabId: string;
    projectId: string;
  };
};
