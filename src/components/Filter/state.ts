import { atom } from 'jotai';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';
import { DEFAULT_CHECKLIST_RENDER_LENGTH } from '@/constants/explore-section/list-views';

type FiltersRenderLengthObjectProps = { [key: string]: number };
const FiltersRenderLengthObject: FiltersRenderLengthObjectProps = {};

Object.keys(EXPLORE_FIELDS_CONFIG).forEach((key) => {
  const config = EXPLORE_FIELDS_CONFIG[key];
  if (config.filter === 'checkList' || config.filter === 'checkListInference') {
    FiltersRenderLengthObject[key] = DEFAULT_CHECKLIST_RENDER_LENGTH;
  }
});

export const FiltersRenderLengthAtom =
  atom<FiltersRenderLengthObjectProps>(FiltersRenderLengthObject);
