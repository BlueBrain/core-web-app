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
  isHidden: boolean;
  onClick?: () => void;
  title?: string;
  selectedBrainRegion?: {
    id: string;
    title: string;
    leaves: string[] | null;
  } | null;
  viewId: string;
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
  path?: string[];
};

export type NeuronCompositionEditorProps = {
  content: (...args: any[]) => ReactElement;
  id: string;
  title?: string;
  composition: number;
  onSliderChange: (value: number) => void;
  trigger: (...args: any[]) => ReactElement;
  isEditable: boolean;
  isLeaf: boolean;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
  about: string;
};
