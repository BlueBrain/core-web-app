import { ReactElement } from 'react';
import { Mesh } from '@/types/ontologies';

export type TitleComponentProps = {
  className?: string;
  content: (...args: any[]) => ReactElement;
  colorCode?: string;
  trigger: (...args: any[]) => ReactElement;
  distributions?: Mesh[] | null;
  id?: string;
  isExpanded: boolean;
  onClick?: () => void;
  title?: string;
  multi?: boolean;
  selectedBrainRegionIds?: Set<string>;
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
  onSliderChange: (value: number) => void;
  max: number;
  isLocked: boolean;
  setLockedFunc: () => void;
  trigger: (...args: any[]) => ReactElement;
  lockIsDisabled: boolean;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};
