import { atom } from 'jotai';
import { DEFAULT_CHECKLIST_RENDER_LENGTH } from '@/constants/explore-section/list-views';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { FilterTypeEnum } from '@/types/explore-section/filters';

type FiltersRenderLengthObjectProps = { [key: string]: number };
const FiltersRenderLengthObject: FiltersRenderLengthObjectProps = {};

Object.keys(EXPLORE_FIELDS_CONFIG).forEach((key) => {
  const config = EXPLORE_FIELDS_CONFIG[key];
  if (config.filter === FilterTypeEnum.CheckList) {
    FiltersRenderLengthObject[key] = DEFAULT_CHECKLIST_RENDER_LENGTH;
  }
});

export const FiltersRenderLengthAtom =
  atom<FiltersRenderLengthObjectProps>(FiltersRenderLengthObject);
