import { ReactElement } from 'react';
import { ClassNexus } from '@/api/ontologies/types';

export type METypeTreeItemProps = {
  content: (...args: any[]) => ReactElement;
  id: string;
  title?: string;
  composition: number;
  trigger: (...args: any[]) => ReactElement;
  isLeaf: boolean;
  isExpanded?: boolean;
  metadata?: ClassNexus;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};

export type DensityOrCount = 'density' | 'count';
