import { atom, useAtom } from 'jotai';

export type PlaybackSpeedId = 'very-slow' | 'slow' | 'default' | 'fast' | 'very-fast';

export interface PlaybackSpeedItem {
  id: PlaybackSpeedId;
  label: string;
  factor: number;
}

/**
 * There are 5 presets for the simulation playback speed.
 */
export function usePlaybackSpeed(): [
  item: PlaybackSpeedItem,
  setId: (id: PlaybackSpeedId) => void,
] {
  const [id, setId] = useAtom(atomPlaybackSpeed);
  const item = PLAYBACK_SPEED_ITEMS[id] ?? PLAYBACK_SPEED_ITEMS.default;
  return [item, setId];
}

export function getAllPlaybackSpeedItems(): PlaybackSpeedItem[] {
  return Object.values(PLAYBACK_SPEED_ITEMS);
}

const DEFAULT_FACTOR = 4;

const PLAYBACK_SPEED_ITEMS: { [key in PlaybackSpeedId]: PlaybackSpeedItem } = {
  'very-slow': {
    id: 'very-slow',
    label: 'Very Slow',
    factor: DEFAULT_FACTOR * 4,
  },
  slow: {
    id: 'slow',
    label: 'Slow',
    factor: DEFAULT_FACTOR * 2,
  },
  default: {
    id: 'default',
    label: 'Default Speed',
    factor: DEFAULT_FACTOR,
  },
  fast: {
    id: 'fast',
    label: 'Fast',
    factor: DEFAULT_FACTOR * 0.5,
  },
  'very-fast': {
    id: 'very-fast',
    label: 'Very Fast',
    factor: DEFAULT_FACTOR * 0.25,
  },
};

const atomPlaybackSpeed = atom<PlaybackSpeedId>('default');
