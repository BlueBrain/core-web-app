// import { useAtomValue } from 'jotai';
// import { selectAtom } from 'jotai/utils';
// import detailedCircuitAtom from '@/state/circuit';

// const circuitConfigPathAtom = selectAtom(
//   detailedCircuitAtom,
//   (value) => value?.circuitConfigPath.url
// );

/**
 * @warn Today (April 15th 2023), we only have one circuit with
 * regions acronyms as node sets.
 * That's why we hard code its path until the other generated circuits
 * also have the regions.
 * This allows us to have something to display, even if this is not the
 * real data. So we can check if everything else works and we can
 * discuss the interface.
 */
export function useCurrentCircuitPath(): string | null {
  return '/gpfs/bbp.cscs.ch/project/proj134/workflow-outputs/31f221e1-33e0-4a0b-a570-e192c95c1674/morphologyAssignmentConfig/root/circuit_config.json';
  // const url = useAtomValue(circuitConfigPathAtom);
  // if (!url) return null;
  // return new URL(url).pathname;
}
