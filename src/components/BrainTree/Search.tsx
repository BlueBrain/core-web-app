import { Dispatch, SetStateAction } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import set from 'lodash/fp/set';
import {
  alternateArrayWithRepresentationAtom,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
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
  const brainRegionsArray = useAtomValue(alternateArrayWithRepresentationAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);

  return (
    <Search
      className="mb-10"
      handleSelect={(_labeledValue, option) => {
        const { ancestors, value: optionValue, label, leaves, representedInAnnotation } = option;

        setValue?.(
          set(
            (ancestors as string) ?? [],
            null,
            value ?? {} // Preserve any already expanded items
          )
        );

        setSelectedBrainRegion(
          optionValue as string,
          label as string,
          leaves ?? null,
          representedInAnnotation
        );

        // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
        setTimeout(() => {
          const selectedNavItem = brainTreeNav?.querySelector(`[data-tree-id="${optionValue}"]`);

          selectedNavItem?.scrollIntoView();
        }, 500);
      }}
      options={
        brainRegionsArray?.map(({ title, id, ancestors, leaves, representedInAnnotation }) => ({
          label: title,
          value: id,
          ancestors,
          leaves,
          representedInAnnotation,
        })) ?? []
      }
      placeholder="Search region..."
    />
  );
}
