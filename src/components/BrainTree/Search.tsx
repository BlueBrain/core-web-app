import { Dispatch, SetStateAction } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { set } from 'lodash/fp';
import { brainRegionsFilteredArrayAtom, setSelectedBrainRegionAtom } from '@/state/brain-regions';
import Search from '@/components/Search';
import { NavValue } from '@/components/TreeNavItem';

/**
 * This component is a wrapper for the TreeNav component that renders a TreeNav using the brain regions data.
 * @param {Object} args
 * @param {(...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>
} args.children - A render-prop.
 */
export default function BrainTreeSearch({
  brainTreeNav,
  setValue,
  value,
}: {
  brainTreeNav?: HTMLDivElement | null;
  setValue?: Dispatch<SetStateAction<NavValue>>;
  value?: NavValue;
}) {
  const brainRegionsFilteredArray = useAtomValue(brainRegionsFilteredArrayAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);

  return (
    <Search
      onSelect={(_labeledValue, option) => {
        const { ancestors, value: optionValue, label, leaves } = option;

        setValue?.(
          set(
            ancestors ?? [],
            null,
            value ?? {} // Preserve any already expanded items
          )
        );

        setSelectedBrainRegion(optionValue, label, leaves ?? null);

        // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
        setTimeout(() => {
          const selectedNavItem = brainTreeNav?.querySelector(`[data-tree-id="${optionValue}"]`);

          selectedNavItem?.scrollIntoView();
        }, 500);
      }}
      options={
        brainRegionsFilteredArray?.map(({ title, id, ancestors, leaves }) => ({
          label: title,
          value: id,
          ancestors,
          leaves,
        })) ?? []
      }
    />
  );
}
