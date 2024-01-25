import { Field } from '@/constants/explore-section/fields-config/enums';
import { DetailProps } from '@/types/explore-section/application';

export type DataTypeConfig = {
  title: string;
  name: string;
  columns: Array<Field>;
  curated: boolean;
  cardViewFields?: DetailProps[];
};
