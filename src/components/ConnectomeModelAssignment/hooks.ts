/* eslint-disable no-param-reassign */
import { useCallback, useMemo, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import uniq from 'lodash/uniq';
import { Session } from 'next-auth';
import {
  RulesData,
  initialParamsAtom,
  initialRulesAtom,
  loadingAtom,
  rulesDataAtom,
  userRulesAtom,
} from './state';
import { compositionAtom } from '@/state/build-composition';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import sessionAtom from '@/state/session';
import { synapseConfigIdAtom } from '@/state/brain-model-config';
import { RulesResource, SynapseConfigPayload, SynapseConfigResource } from 'src/types/nexus';
import {
  fetchJsonFileByUrl,
  fetchResourceById,
  updateJsonFileByUrl,
  updateResource,
} from '@/api/nexus';
import { usePrevious } from '@/hooks/hooks';
import { createDistribution, setRevision } from '@/util/nexus';

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

async function fetchRules(
  synapseConfigId: string,
  session: Session,
  onSuccess: (data: RulesData) => void
) {
  const configResource = await fetchResourceById<SynapseConfigResource>(synapseConfigId, session);
  const configPayload = await fetchJsonFileByUrl<SynapseConfigPayload>(
    setRevision(configResource.distribution.contentUrl, null),
    session
  );

  const { id } = configPayload.synaptic_assignment;
  const rulesEntity = await fetchResourceById<RulesResource>(id, session);

  const rules = await fetchJsonFileByUrl<SynapticAssignmentRule[]>(
    setRevision(rulesEntity.distribution.contentUrl, null),
    session
  );

  onSuccess({
    configResource,
    configPayload,
    rulesEntity,
    rules,
  });
}

export function useDefaultRules(): SynapticAssignmentRule[] {
  const initialRules = useAtomValue(initialRulesAtom);
  return useMemo(() => initialRules?.slice(0, 4) || [], [initialRules]);
}

const useOnFetchSuccess = () => {
  const setRulesData = useSetAtom(rulesDataAtom);
  const initialRules = useAtomValue(initialRulesAtom);
  const setUserRules = useSetAtom(userRulesAtom);
  return (rulesData: RulesData) => {
    if (!initialRules) {
      throw new Error('Initial rules not loaded');
    }
    setRulesData(rulesData);
    const rules = rulesData.rules.length > 4 ? rulesData.rules.slice(4) : initialRules.slice(4);
    setUserRules(rules);
  };
};

export function useFetchRules(): SynapticAssignmentRule[] {
  const session = useAtomValue(sessionAtom);
  const synapseConfigId = useAtomValue(synapseConfigIdAtom);
  const prevSynapseConfigId = usePrevious(synapseConfigId);
  const initialRules = useAtomValue(initialRulesAtom);
  const setRulesData = useSetAtom(rulesDataAtom);
  const [userRules, setUserRules] = useAtom(userRulesAtom);
  const onFetchSuccess = useOnFetchSuccess();

  useEffect(() => {
    if (!synapseConfigId || !session || synapseConfigId === prevSynapseConfigId || !initialRules)
      return;

    setRulesData(null);
    setUserRules([]);
    fetchRules(synapseConfigId, session, onFetchSuccess);
  }, [
    session,
    synapseConfigId,
    prevSynapseConfigId,
    setRulesData,
    setUserRules,
    initialRules,
    onFetchSuccess,
  ]);

  return userRules;
}

export function useSetRules() {
  const setUserRules = useSetAtom(userRulesAtom);
  const rulesData = useAtomValue(rulesDataAtom);
  const session = useAtomValue(sessionAtom);
  const synapseConfigId = useAtomValue(synapseConfigIdAtom);
  const defaultRules = useDefaultRules();
  const onFetchSuccess = useOnFetchSuccess();
  const [loading, setLoading] = useAtom(loadingAtom);

  return async (rules: SynapticAssignmentRule[]) => {
    setUserRules(rules);

    if (defaultRules.length < 4) throw new Error('Incomplete default rules');

    if (!synapseConfigId || !session || loading || defaultRules.length < 4) return;
    setLoading(true);
    await updateRules(rulesData, [...defaultRules, ...rules], session);
    await fetchRules(synapseConfigId, session, onFetchSuccess);
    setLoading(false);
  };
}

export async function updateRules(
  rulesData: Omit<RulesData, 'rules'> | null,
  rules: SynapticAssignmentRule[],
  session: Session | null
) {
  if (!rulesData || !session) return;

  const fileMeta = await updateJsonFileByUrl(
    rulesData.rulesEntity.distribution.contentUrl,
    rules,
    'synaptic_assignment.json',
    session
  );

  rulesData.rulesEntity.distribution = createDistribution(fileMeta);

  await updateResource(rulesData.rulesEntity, rulesData.rulesEntity._rev, session);

  rulesData.configPayload.synaptic_assignment.rev = parseRevfromUrl(
    rulesData.rulesEntity.distribution.contentUrl
  );

  const updatedConfigPayloadMeta = await updateJsonFileByUrl(
    rulesData.configResource.distribution.contentUrl,
    rulesData.configPayload,
    'synaptic_assignment.json',
    session
  );

  rulesData.configResource.distribution = createDistribution(updatedConfigPayloadMeta);

  await updateResource(rulesData.configResource, rulesData.configResource._rev, session);
}

function parseRevfromUrl(url: string) {
  const urlObj = new URL(url);
  const rev = urlObj.searchParams.get('rev') || '1';
  return parseInt(rev, 10);
}
