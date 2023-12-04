import React, {
  Dispatch,
  ForwardedRef,
  ReactElement,
  SetStateAction,
  forwardRef,
  useCallback,
} from 'react';
import { useAtomValue } from 'jotai';
import { handleNavValueChange } from './util';
import { alternateTreeWithRepresentationAtom } from '@/state/brain-regions';
import TreeNav from '@/components/TreeNavItem';
import { NavValue } from '@/state/brain-regions/types';

/**
 * This component is a wrapper for the TreeNav component that renders a TreeNav using the brain regions data.
 * @param {Object} args
 * @param {(...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>
} args.children - A render-prop.
 * @param {ForwardedRef} ref - A forwarded React ref.
 */
function Nav(
  {
    children,
    setValue,
    value,
  }: {
    children: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
    setValue: Dispatch<SetStateAction<NavValue>>;
    value: NavValue;
  },
  ref?: ForwardedRef<HTMLDivElement>
) {
  const brainRegions = useAtomValue(alternateTreeWithRepresentationAtom);
  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(value, setValue);

      return callback(newValue, path);
    },
    [value, setValue]
  );

  return brainRegions ? (
    <TreeNav items={brainRegions} onValueChange={onValueChange} ref={ref} value={value}>
      {children}
    </TreeNav>
  ) : null;
}

export default forwardRef(Nav);
