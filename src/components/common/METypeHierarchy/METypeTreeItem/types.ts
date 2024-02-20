import { ReactElement } from 'react';
import { ClassNexus } from '@/api/ontologies/types';

export type DensityOrCount = 'density' | 'count';

export type METypeTreeItemsProps = {
  id: string;
  composition: number;
  metadata?: ClassNexus;

  title?: string;
  about?: string;
  densityOrCount: DensityOrCount;

  isLeaf: boolean;
  isExpanded?: boolean;
  isEditable: boolean;

  content: (...args: any[]) => ReactElement;
  trigger: (...args: any[]) => ReactElement;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
  onSliderChange?: (value: number) => void;
};

export type METypeItem = {
  about: string;
  composition: number;
  content: (...args: any[]) => ReactElement;
  id: string;
  title?: string;
  isExpanded: boolean;
  parentId: string;
  trigger: (...args: any[]) => ReactElement;
  path?: string[];
};
