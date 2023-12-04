import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { SelectProps } from 'antd/es/select';

import { generateHierarchyPathTree } from './util';
import {
  alternateArrayWithRepresentationAtom,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import Search from '@/components/Search';
import { NavValue } from '@/state/brain-regions/types';

type SearchOption = {
  ancestors: string[] | undefined;
  leaves: string[] | undefined;
  representedInAnnotation: boolean;
  label: string;
  value: string;
};

/**
 * This component is a wrapper for the TreeNav component that renders a TreeNav using the brain regions data.
 * @param brainTreeNav container of the tree, used to select the node selected from the search dropdown from the brain regions tree
 * @param BrainTreeSearch.setValue Add new opened node to the tree  hierarchy state
 * @param BrainTreeSearch.value Tree hierarchy state
 * @param {(...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>
 */
export default function BrainTreeSearch({
  brainTreeNav,
  setValue,
}: {
  brainTreeNav?: HTMLDivElement | null;
  setValue?: Dispatch<SetStateAction<NavValue>>;
}) {
  const brainRegionsArray = useAtomValue(alternateArrayWithRepresentationAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);

  const options = useMemo(
    () =>
      brainRegionsArray?.map(({ title, id, ancestors, leaves, representedInAnnotation }) => ({
        label: title,
        value: id,
        ancestors,
        leaves,
        representedInAnnotation,
      })) ?? [],
    [brainRegionsArray]
  );

  const handleSelect = useCallback(
    (_labeledValue: string, option: SearchOption) => {
      const { ancestors, value: optionValue, label, leaves, representedInAnnotation } = option;

      setValue?.(generateHierarchyPathTree(ancestors!));

      setSelectedBrainRegion(
        optionValue as string,
        label as string,
        leaves ?? null,
        representedInAnnotation
      );

      // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
      setTimeout(() => {
        const selectedNavItem = brainTreeNav?.querySelector(`[data-tree-id="${optionValue}"]`);
        selectedNavItem?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
      }, 500);
    },
    [brainTreeNav, setSelectedBrainRegion, setValue]
  ) as SelectProps['onSelect'];

  return (
    <Search<SearchOption>
      className="mb-10"
      handleSelect={handleSelect}
      options={options}
      placeholder="Search region..."
    />
  );
}
