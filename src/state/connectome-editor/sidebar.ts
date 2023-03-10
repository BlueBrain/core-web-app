import { atom } from 'jotai';

export type BrainArea = 'pre' | 'post' | null;
export default atom<BrainArea>(null);
