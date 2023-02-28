import { ReactElement } from 'react';

export type TitleComponentProps = {
  className?: string;
  content: (...args: any[]) => ReactElement;
  colorCode?: string;
  trigger: (...args: any[]) => ReactElement;
  id?: string;
  isExpanded: boolean;
  onClick?: () => void;
  title: string;
  multi?: boolean;
  selectedBrainRegions: Map<string, string>;
  children?: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
};
