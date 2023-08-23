import { atom } from 'jotai';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { DEFAULT_CHECKLIST_RENDER_LENGTH } from '@/constants/explore-section/list-views';

type FiltersRenderLengthObjectProps = { [key: string]: number };
const FiltersRenderLengthObject: FiltersRenderLengthObjectProps = {};

Object.keys(LISTING_CONFIG).forEach((key) => {
  const config = LISTING_CONFIG[key];
  if (config.filter === 'checkList' || config.filter === 'checkListInference') {
    FiltersRenderLengthObject[key] = DEFAULT_CHECKLIST_RENDER_LENGTH;
  }
});

export const FiltersRenderLengthAtom =
  atom<FiltersRenderLengthObjectProps>(FiltersRenderLengthObject);
