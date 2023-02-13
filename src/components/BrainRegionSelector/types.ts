import { ReactElement } from 'react';
import { MeshDistribution } from '@/types/atlas';

export type TitleComponentProps = {
  className?: string;
  content: (...args: any[]) => ReactElement;
  colorCode?: string;
  trigger: (...args: any[]) => ReactElement;
  distributions?: MeshDistribution[] | null;
  id?: string;
  isExpanded: boolean;
  onClick?: (id: string) => void;
  title?: string;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};

export type NeuronCompositionItem = {
  about: string;
  composition: number;
  content: (...args: any[]) => ReactElement;
  id: string;
  title?: string;
  isExpanded: boolean;
  parentId: string;
  trigger: (...args: any[]) => ReactElement;
};

export type CompositionTitleProps = {
  content: (...args: any[]) => ReactElement;
  title?: string;
  isExpanded: boolean;
  composition: number;
  onSliderChange: (value: number | null) => void;
  max: number;
  isLocked: boolean;
  setLockedFunc: () => void;
  trigger: (...args: any[]) => ReactElement;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};

export type CompositionListProps = {
  composition: number;
  title: string;
  trigger: (...args: any[]) => ReactElement;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};
