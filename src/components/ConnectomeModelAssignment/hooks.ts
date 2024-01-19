/* eslint-disable no-param-reassign */
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import uniq from 'lodash/uniq';
import { Session } from 'next-auth';
import {
  SynapseEditorData,
  initialTypesAtom,
  initialRulesAtom,
  loadingAtom,
  rulesDataAtom,
  userRulesAtom,
  userTypesAtom,
} from './state';
import { compositionAtom } from '@/state/build-composition';
import { SynapticAssignmentRule, SynapticType } from '@/types/connectome-model-assignment';
import sessionAtom from '@/state/session';
import { synapseConfigIdAtom } from '@/state/brain-model-config';
import {
  RulesResource,
  SynapseConfigPayload,
  SynapseConfigResource,
  TypesResource,
} from 'src/types/nexus';
import {
  fetchJsonFileByUrl,
  fetchResourceById,
  updateJsonFileByUrl,
  updateResource,
} from '@/api/nexus';
import { usePrevious } from '@/hooks/hooks';
import { createDistribution } from '@/util/nexus';
import { supportedUIConfigVersion } from '@/constants/configs';
import { brainRegionsAtom } from '@/state/brain-regions';

/**
 * Return a function that provides all the possible values
 * for a given field.
 */
export function useFieldsOptionsProvider(): (field: keyof SynapticAssignmentRule) => string[] {
  const composition = useAtomValue(compositionAtom);
  const initialTypes = useAtomValue(initialTypesAtom);
  const initialTypeNames = useMemo(() => initialTypes && Object.keys(initialTypes), [initialTypes]);
  const userTypes = useAtomValue(userTypesAtom);
  const userTypeNames = useMemo(() => userTypes.map(([name]) => name), [userTypes]);
  const types = useMemo(() => {
    const usortedTypes = userTypeNames?.length > 0 ? userTypeNames : initialTypeNames ?? [];
    return [...usortedTypes].sort((a, b) => a.localeCompare(b));
  }, [userTypeNames, initialTypeNames]);
  const brainRegions = useAtomValue(brainRegionsAtom);
  const brainRegionNames = useMemo(() => brainRegions?.map((br) => br.label), [brainRegions]);

  const arrays = useMemo(() => {
    const mTypes: string[] = [];
    const eTypes: string[] = [];

    if (composition)
      Object.entries(composition.hasPart).forEach((brainRegion) => {
        Object.values(brainRegion[1].hasPart).forEach((mType) => {
          mTypes.push(mType.label);
          Object.values(mType.hasPart).forEach((eType) => eTypes.push(eType.label));
        });
      });

    const uMtypes = uniq(mTypes);
    const ueTypes = uniq(eTypes);

    return {
      fromSClass: ['INH', 'EXC'],
      toSClass: ['INH', 'EXC'],
      fromHemisphere: ['left', 'right'],
      toHemisphere: ['left', 'right'],
      fromRegion: brainRegionNames,
      toRegion: brainRegionNames,
      fromMType: uMtypes,
      toMType: uMtypes,
      fromEType: ueTypes,
      toEType: ueTypes,
      synapticType: types,
    };
  }, [composition, types, brainRegionNames]);

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
  onSuccess: (
    data: SynapseEditorData,
    rules: SynapticAssignmentRule[],
    types: { [type: string]: SynapticType }
  ) => void
) {
  const configResource = await fetchResourceById<SynapseConfigResource>(synapseConfigId, session);

  if (configResource.configVersion !== supportedUIConfigVersion.synapseConfig)
    throw new Error('Config version is not supported by Synapse Editor');

  const configPayload = await fetchJsonFileByUrl<SynapseConfigPayload>(
    configResource.distribution.contentUrl,
    session
  );

  const rulesEntity = await fetchResourceById<RulesResource>(
    configPayload.configuration.synapse_properties.id,
    session
  );
  const typesEntity = await fetchResourceById<TypesResource>(
    configPayload.configuration.synapses_classification.id,
    session
  );

  const rules = await fetchJsonFileByUrl<SynapticAssignmentRule[]>(
    rulesEntity.distribution.contentUrl,
    session
  );

  const types = await fetchJsonFileByUrl<{ [type: string]: SynapticType }>(
    typesEntity.distribution.contentUrl,
    session
  );

  onSuccess(
    {
      configResource,
      configPayload,
      rulesEntity,
      typesEntity,
    },
    rules,
    types
  );
}

export function useDefaultRules(): SynapticAssignmentRule[] {
  const initialRules = useAtomValue(initialRulesAtom);
  return useMemo(() => initialRules?.slice(0, 4) || [], [initialRules]);
}

const useOnFetchSuccess = () => {
  const setRulesData = useSetAtom(rulesDataAtom);
  const initialRules = useAtomValue(initialRulesAtom);
  const setUserRules = useSetAtom(userRulesAtom);
  const initialTypes = useAtomValue(initialTypesAtom);
  const setUserTypes = useSetAtom(userTypesAtom);

  return (
    rulesData: SynapseEditorData,
    rules: SynapticAssignmentRule[],
    types: { [type: string]: SynapticType }
  ) => {
    if (!initialRules || !initialTypes) {
      throw new Error('Initial rules not loaded');
    }
    setRulesData(rulesData);
    const userRules = rules.length > 4 ? rules.slice(4) : initialRules.slice(4);
    setUserRules(userRules);
    const userTypes = Array.from(Object.keys(types)).length > 0 ? types : initialTypes;
    setUserTypes(Array.from(Object.entries(userTypes)));
  };
};

export function useFetch() {
  const session = useAtomValue(sessionAtom);
  const synapseConfigId = useAtomValue(synapseConfigIdAtom);
  const prevSynapseConfigId = usePrevious(synapseConfigId);
  const initialRules = useAtomValue(initialRulesAtom);
  const setRulesData = useSetAtom(rulesDataAtom);
  const setUserRules = useSetAtom(userRulesAtom);
  const setTypes = useSetAtom(userTypesAtom);
  const onFetchSuccess = useOnFetchSuccess();
  const [error, setError] = useState<string>();

  if (error) {
    throw new Error(error);
  }

  useEffect(() => {
    if (!synapseConfigId || !session || synapseConfigId === prevSynapseConfigId || !initialRules)
      return;

    setRulesData(null);
    setUserRules([]);
    setTypes([]);
    (async () => {
      try {
        await fetchRules(synapseConfigId, session, onFetchSuccess);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, [
    session,
    synapseConfigId,
    prevSynapseConfigId,
    setRulesData,
    setUserRules,
    setTypes,
    initialRules,
    onFetchSuccess,
  ]);
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

    if (!synapseConfigId || !session || loading || defaultRules.length < 4 || !rulesData) return;
    setLoading(true);
    await updateRules(rulesData, [...defaultRules, ...rules], session);
    await fetchRules(synapseConfigId, session, onFetchSuccess);
    setLoading(false);
  };
}

export function useSetTypes() {
  const setUserTypes = useSetAtom(userTypesAtom);
  const data = useAtomValue(rulesDataAtom);
  const session = useAtomValue(sessionAtom);
  const synapseConfigId = useAtomValue(synapseConfigIdAtom);
  const onFetchSuccess = useOnFetchSuccess();
  const [loading, setLoading] = useAtom(loadingAtom);

  return async (types: [string, SynapticType][]) => {
    setUserTypes(types);

    if (!synapseConfigId || !session || loading || !data) return;
    setLoading(true);

    await updateTypes(data, Object.fromEntries(types), session);
    await fetchRules(synapseConfigId, session, onFetchSuccess);
    setLoading(false);
  };
}

export async function updateRules(
  rulesData: SynapseEditorData,
  rules: SynapticAssignmentRule[],
  session: Session
) {
  const fileMeta = await updateJsonFileByUrl(
    rulesData.rulesEntity.distribution.contentUrl,
    rules,
    'synaptic_assignment.json',
    session
  );

  rulesData.rulesEntity.distribution = createDistribution(fileMeta);

  await updateResource(rulesData.rulesEntity, session);

  rulesData.configPayload.configuration.synapse_properties.rev = parseRevfromUrl(
    rulesData.rulesEntity.distribution.contentUrl
  );

  const updatedConfigPayloadMeta = await updateJsonFileByUrl(
    rulesData.configResource.distribution.contentUrl,
    rulesData.configPayload,
    'synaptic_assignment.json',
    session
  );

  rulesData.configResource.distribution = createDistribution(updatedConfigPayloadMeta);

  await updateResource(rulesData.configResource, session);
}

export async function updateTypes(
  data: SynapseEditorData,
  types: { [type: string]: SynapticType },
  session: Session
) {
  const fileMeta = await updateJsonFileByUrl(
    data.typesEntity.distribution.contentUrl,
    types,
    'synaptic_parameters.json',
    session
  );

  data.typesEntity.distribution = createDistribution(fileMeta);

  await updateResource(data.typesEntity, session);

  data.configPayload.configuration.synapses_classification.rev = parseRevfromUrl(
    data.typesEntity.distribution.contentUrl
  );

  const updatedConfigPayloadMeta = await updateJsonFileByUrl(
    data.configResource.distribution.contentUrl,
    data.configPayload,
    'synaptic_assignment.json',
    session
  );

  data.configResource.distribution = createDistribution(updatedConfigPayloadMeta);

  await updateResource(data.configResource, session);
}

function parseRevfromUrl(url: string) {
  const urlObj = new URL(url);
  const rev = urlObj.searchParams.get('rev') || '1';
  return parseInt(rev, 10);
}

export function useSynapseTypeUseCount() {
  const [userRules] = useAtom(userRulesAtom);
  const defaultRules = useDefaultRules();

  return useMemo(() => {
    const usedTypes = [...defaultRules, ...userRules].map((r) => r.synapticType);
    return usedTypes.reduce((counts: { [type: string]: number }, type) => {
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});
  }, [defaultRules, userRules]);
}

export function useTypeNameCount() {
  const types = useAtomValue(userTypesAtom);
  return useMemo(
    () =>
      types.reduce((counts: { [typeName: string]: number }, [type]) => {
        const baseName = type.includes('__') ? type.split('__')[0] : type;
        counts[baseName] = (counts[baseName] || 0) + 1;
        return counts;
      }, {}),
    [types]
  );
}
