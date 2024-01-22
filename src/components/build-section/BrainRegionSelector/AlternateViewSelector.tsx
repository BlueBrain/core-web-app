import { useCallback, useReducer } from 'react';
import { useSetAtom } from 'jotai';
import filter from 'lodash/filter';

import SelectView, { ViewOption } from './SelectView';
import { BrainViewId, BrainRegionOntologyView } from '@/types/ontologies';
import { addOrRemoveSelectedAlternateView } from '@/state/brain-regions';

type AlternateViewProps = {
  brainRegionViews: BrainRegionOntologyView[] | null;
  defaultViewOption?: ViewOption;
  id?: string;
  viewOptions?: ViewOption[];
  selectedBrainRegion?: string;
  colorCode?: string;
};

export default function AlternateViewSelector({
  brainRegionViews,
  defaultViewOption,
  id,
  viewOptions,
  selectedBrainRegion,
  colorCode,
}: AlternateViewProps) {
  const changeSelectedViews = useSetAtom(addOrRemoveSelectedAlternateView);
  const [openDropdown, toggleDropdown] = useReducer((prev) => !prev, false);
  /**
   * Function to trigger the changing of view
   * @param newViewId the selected view id
   */
  const onChangeViewSelection = useCallback(
    (newViewId: BrainViewId | undefined) => {
      if (id && newViewId) {
        changeSelectedViews(newViewId, id);
      }
    },
    [changeSelectedViews, id]
  );

  // first count the non disabled options
  const nonDisabled = filter(viewOptions, ['isDisabled', false]).length ?? 0;

  // if the non-disabled options are less than 2, then render only the label
  // without the selector
  if (id === selectedBrainRegion && nonDisabled < 2 && defaultViewOption) {
    return (
      <span
        style={{ color: colorCode }}
        className="text-neutral-1 font-thin text-[10px] text-left mix-blend-difference"
      >
        {defaultViewOption.label}
      </span>
    );
  }

  if (id === selectedBrainRegion && brainRegionViews && viewOptions && defaultViewOption) {
    return (
      <SelectView
        {...{
          colorCode,
          openDropdown,
          defaultViewOption,
          viewOptions,
          onChangeViewSelection,
          toggleDropdown,
        }}
      />
    );
  }

  return null;
}
