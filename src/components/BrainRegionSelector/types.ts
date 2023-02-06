import { ReactElement, ReactNode } from 'react';
import { MeshDistribution } from '@/types/atlas';

export type TitleComponentProps = {
  colorCode?: string;
  trigger: ReactNode;
  distributions?: MeshDistribution[] | null;
  id?: string;
  onClick?: (id: string) => void;
  title?: string;
  selectedId?: string;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};

export type CompositionListProps = {
  composition: number;
  title: string;
  trigger: ReactNode;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};
