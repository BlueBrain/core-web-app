import { ReactElement } from 'react';
import { MeshDistribution } from '@/types/atlas';

type TitleComponentProps = {
  colorCode?: string;
  children?: ReactElement;
  distributions?: MeshDistribution[] | null;
  id?: string;
  onClick?: (id: string) => void;
  title?: string;
  selectedId?: string;
};

export default TitleComponentProps;
