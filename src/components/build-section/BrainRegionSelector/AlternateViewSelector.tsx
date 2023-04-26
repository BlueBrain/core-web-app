import React, { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { addOrRemoveSelectedAlternateView } from '@/state/brain-regions';
import { BrainRegionOntologyView } from '@/types/ontologies';
import SelectDropdown from '@/components/SelectDropdown';

type AlternateViewProps = {
  brainRegionViews: BrainRegionOntologyView[] | null;
  defaultViewOption: { value: string; label: string; isDisabled: boolean } | undefined;
  id: string | undefined;
  selectOptions:
    | {
        value: string;
        label: string;
        isDisabled: boolean;
      }[]
    | undefined;
  selectedBrainRegion: string | undefined;
};

export default function AlternateViewSelector({
  brainRegionViews,
  defaultViewOption,
  id,
  selectOptions,
  selectedBrainRegion,
}: AlternateViewProps) {
  const changeSelectedViews = useSetAtom(addOrRemoveSelectedAlternateView);

  /**
   * Function to trigger the changing of view
   * @param newViewId the selected view id
   */
  const onChangeViewSelection = useCallback(
    (newViewId: string | undefined) => {
      if (id && newViewId) {
        changeSelectedViews(newViewId, id);
      }
    },
    [changeSelectedViews, id]
  );

  // first count the non disabled options
  let nonDisabled = 0;
  selectOptions?.forEach((option) => {
    if (!option.isDisabled) {
      nonDisabled += 1;
    }
  });

  // if the non-disabled options are less than 2, then render only the label
  // without the selector
  if (id === selectedBrainRegion && nonDisabled < 2 && defaultViewOption) {
    return (
      <span className="text-neutral-1 font-thin text-[10px] text-left">
        {defaultViewOption.label}
      </span>
    );
  }

  if (id === selectedBrainRegion && brainRegionViews && selectOptions && defaultViewOption) {
    return (
      <SelectDropdown
        defaultOption={defaultViewOption}
        selectOptions={selectOptions}
        onChangeFunc={onChangeViewSelection}
      />
    );
  }

  return null;
}
