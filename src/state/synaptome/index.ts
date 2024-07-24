import { atomFamily, atomWithReset } from "jotai/utils";

export type Coordinates3D = [number, number, number];

export type SynapsePosition = {
  segment_id: number;
  coordinates: Coordinates3D;
  position: number;
}

export type SectionSynapses = {
  section_id: string;
  synapses: Array<SynapsePosition>;
}

export type SectionSynapsesWithId = {
  group_id: string;
} & Partial<SectionSynapses>

export const synapsesPlacementAtom = atomFamily(
  ({ section_id, group_id, synapses }: SectionSynapsesWithId) => atomWithReset({ group_id, section_id, synapses }),
  (nodeA, nodeB) => nodeA.group_id === nodeB.group_id
);
