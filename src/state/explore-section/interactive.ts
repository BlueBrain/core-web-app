import { atomWithReset } from 'jotai/utils';

// Keeps track of the visible interactive brain regions
export const visibleExploreBrainRegionsAtom = atomWithReset<string[]>([]);
