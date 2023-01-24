import { ReactElement } from 'react';
import { MeshDistribution } from '@/types/atlas';

type HeaderProps = {
  label: string | React.ReactElement;
  icon: React.ReactElement;
};

type TitleComponentProps = {
  colorCode?: string;
  children?: ReactElement;
  distributions?: MeshDistribution[] | null;
  id?: string;
  onClick?: (id: string) => void;
  title?: string;
  selectedId?: string;
};

export type { HeaderProps, TitleComponentProps };
