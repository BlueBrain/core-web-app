import { useCallback, useMemo, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import uniq from 'lodash/uniq';
import { initialParamsAtom } from './state';
import { compositionAtom } from '@/state/build-composition';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import { synapticAssignmentRules } from '@/state/brain-model-config/synapse-editor';

/**
 * Return a function that provides all the possible values
 * for a given field.
 */
export function useFieldsOptionsProvider(): (field: keyof SynapticAssignmentRule) => string[] {
  const composition = useAtomValue(compositionAtom);
  const synapseTypes = useAtomValue(initialParamsAtom);

  const arrays = useMemo(() => {
    const brainRegions: string[] = [];
    const mTypes: string[] = [];
    const eTypes: string[] = [];

    if (composition)
      Object.entries(composition.hasPart).forEach((brainRegion) => {
        brainRegions.push(brainRegion[1].label);

        Object.values(brainRegion[1].hasPart).forEach((mType) => {
          mTypes.push(mType.label);
          Object.values(mType.hasPart).forEach((eType) => eTypes.push(eType.label));
        });
      });

    const ubrainRegions = uniq(brainRegions);
    const uMtypes = uniq(mTypes);
    const ueTypes = uniq(eTypes);

    return {
      fromSClass: ['INH', 'EXC'],
      toSClass: ['INH', 'EXC'],
      fromHemisphere: ['left', 'right'],
      toHemisphere: ['left', 'right'],
      fromRegion: ubrainRegions,
      toRegion: ubrainRegions,
      fromMType: uMtypes,
      toMType: uMtypes,
      fromEType: ueTypes,
      toEType: ueTypes,
      synapticType: Array.from(Object.keys(synapseTypes ?? [])),
    };
  }, [composition, synapseTypes]);

  return useCallback((field: keyof SynapticAssignmentRule) => arrays[field] ?? [], [arrays]);
}

/**
 * @returns A function that provides a user friendly label
 * for given identifiers.
 */
export function useLabelsProvider(): (field: string) => string {
  return useCallback((field: string) => LABELS[field] ?? field, []);
}

const LABELS: { [key: string]: string } = {
  fromHemisphere: 'Hemisphere',
  toHemisphere: 'Hemisphere',
  fromRegion: 'Region',
  toRegion: 'Region',
  fromSClass: 'SClass',
  toSClass: 'SClass',
  fromMType: 'M-Type',
  toMType: 'M-Type',
  fromEType: 'E-Type',
  toEType: 'E-Type',
  SS: 'Somatosensory cortex',
};

export function useRules(): [
  defaultRules: SynapticAssignmentRule[],
  userRules: SynapticAssignmentRule[],
  setUserRules: (rules: SynapticAssignmentRule[]) => void
] {
  const rules = useAtomValue(synapticAssignmentRules);

  const [defaultRules, setDefaultRules] = useState<SynapticAssignmentRule[]>([]);
  const [userRules, setUserRules] = useState<SynapticAssignmentRule[]>([]);
  useEffect(() => {
    if (!rules) return;

    setDefaultRules(rules.slice(0, 4));
    setUserRules(rules.slice(4));
  }, [rules]);
  return [defaultRules, userRules, setUserRules];
}
