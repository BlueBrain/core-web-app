import { MModelMenuItem } from './m-model';

export interface EModel {
  label: string;
  id: string;
  mType: MModelMenuItem;
}

export interface EModelMenuItem extends EModel {
  annotation?: string;
  uuid: string;
}
