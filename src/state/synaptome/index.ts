import { atom } from 'jotai';

export type Coordinates3D = [number, number, number];

export const SynapseTypeColorMap = {
  110: 0xf43f5e, // Excitatory Synapses
  10: 0x3b82f6, // Inhibitory Synapses
};

export type SynapseTypeColorMapKey = keyof typeof SynapseTypeColorMap;

export type SynapsePosition = {
  segment_id: number;
  coordinates: Coordinates3D;
  position: number;
};

export type SectionSynapses = {
  section_id: string;
  synapses: Array<SynapsePosition>;
};

type SectionSynapsesWith3D = {
  sectionSynapses: Array<SectionSynapses>;
  meshId?: string;
};

export const synapsesPlacementAtom = atom<Record<string, SectionSynapsesWith3D | null> | null>(
  null
);
