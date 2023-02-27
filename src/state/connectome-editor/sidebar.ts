import { atom } from 'jotai/vanilla';

export type BrainArea = 'pre' | 'post' | null;
export default atom<BrainArea>(null);
