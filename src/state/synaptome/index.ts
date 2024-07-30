import { atom } from 'jotai';

import { SynapseBubble } from '@/services/bluenaas-single-cell/renderer';

export type Coordinates3D = [number, number, number];

export const SynapseTypeColorMap = {
  110: 0xf43f5e,
  10: 0x3b82f6,
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
  threeDObjects?: Array<SynapseBubble>;
};

export const synapsesPlacementAtom = atom<Record<string, SectionSynapsesWith3D | null> | null>(
  null
);
