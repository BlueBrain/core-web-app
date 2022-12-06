import { atom } from 'jotai';

// TODO: to be filled with correct data structure and moved to @/types/nexus
interface BrainModelConfig {
  name: string;
}

const PLACEHOLDER_BRAIN_MODEL_CONFIG = {
  name: 'Release 23.01',
};

const brainModelConfigAtom = atom<BrainModelConfig | null>(PLACEHOLDER_BRAIN_MODEL_CONFIG);

export default brainModelConfigAtom;
