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

export type NeuronCompositionItem = {
  about: string;
  composition: number;
  id: string;
  title?: string;
  isExpanded: boolean;
  parentId: string;
  trigger: ReactNode;
};

export type CompositionTitleProps = {
  title?: string;
  isExpanded: boolean;
  composition: number;
  onSliderChange: (value: number | null) => void;
  max: number;
  isLocked: boolean;
  setLockedFunc: () => void;
  trigger: ReactNode;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};

export type CompositionListProps = {
  composition: number;
  title: string;
  trigger: ReactNode;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};
