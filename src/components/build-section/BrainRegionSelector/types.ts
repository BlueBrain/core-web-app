import { ReactElement } from 'react';
import { BrainViewId, Mesh } from '@/types/ontologies';

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
  selectedBrainRegion?: {
    id: string;
    title: string;
    leaves: string[] | null;
  } | null;
  viewId: BrainViewId;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
  scope?: string;
};
