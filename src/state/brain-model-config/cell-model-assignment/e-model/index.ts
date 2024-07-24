import { atom } from 'jotai';
import groupBy from 'lodash/groupBy';
import lodashFind from 'lodash/find';

import {
  AllFeatureKeys,
  EModel,
  EModelConfiguration,
  EModelConfigurationParameter,
  EModelConfigurationPayload,
  MechanismForUI,
  EModelUIConfig,
  EModelWorkflow,
  ExemplarMorphologyDataType,
  ExperimentalTracesDataType,
  ExtractionTargetsConfiguration,
  FeatureParameterGroup,
  FeaturePresetName,
  NeuronMorphology,
  SimulationParameter,
  Trace,
  EModelByETypeMappingType,
  EModelMenuItem,
  EModelOptimizationConfigResource,
  EModelResource,
  DefaultEModelType,
  EModelScript,
} from '@/types/e-model';
import { fetchJsonFileById, fetchJsonFileByUrl, fetchResourceById, queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';
import {
  convertRemoteParamsForUI,
  convertMorphologyForUI,
  convertTraceForUI,
  convertFeaturesForUI,
  convertMechanismsForUI,
} from '@/services/e-model';
import {
  getEModelOptimizationConfigQuery,
  getEModelQuery,
  getEntityListByIdsQuery,
} from '@/queries/es';
import {
  DEFAULT_E_MODEL_STORAGE_KEY,
  eTypeMechanismMapId,
  featureAutoTargets,
  presetNames,
} from '@/constants/cell-model-assignment/e-model';
import { brainRegionsAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { DEFAULT_BRAIN_REGION_STORAGE_KEY } from '@/constants/brain-hierarchy';
import { getInitializationValue } from '@/util/utils';
import { DefaultBrainRegionType } from '@/state/brain-regions/types';
import { ensureArray } from '@/util/nexus';

const initializationBrainRegion = getInitializationValue<DefaultBrainRegionType>(
  DEFAULT_BRAIN_REGION_STORAGE_KEY
);

const initializationEModel = getInitializationValue<DefaultEModelType>(DEFAULT_E_MODEL_STORAGE_KEY);

const useSavedEModel =
  (initializationBrainRegion &&
    initializationBrainRegion?.value?.id === initializationEModel?.brainRegionId) ||
  (typeof window !== 'undefined' &&
    initializationEModel?.brainRegionId ===
      new URLSearchParams(window.location.search).get('eModelBrainRegion'));

export const selectedEModelAtom = atom<EModelMenuItem | null>(
  useSavedEModel ? initializationEModel.value : null
);

export const eModelRemoteParamsLoadedAtom = atom(false);

export const refetchTriggerAtom = atom<{}>({});

export const simulationParametersAtom = atom<Promise<SimulationParameter | null>>(async (get) => {
  const isOptimizationConfig = get(selectedEModelAtom)?.isOptimizationConfig;

  if (isOptimizationConfig) {
    const payload = await get(eModelOptimizationPayloadAtom);
    return payload?.parameters || null;
  }

  const remoteParameters = await get(eModelParameterAtom);

  if (!remoteParameters) return null;

  const simParams = convertRemoteParamsForUI({
    parameters: remoteParameters,
    // default to 20 because the original is > 500
    maxGenerations: 20,
  });
  return simParams;
});

export const featureSelectedPresetAtom = atom<FeaturePresetName>('firing_pattern');

export const featureParametersAtom = atom<Promise<FeatureParameterGroup | null>>(async (get) => {
  const featureSelectedPreset = get(featureSelectedPresetAtom) || presetNames[0];
  if (!featureSelectedPreset) return null;

  const featuresPerPreset = featureAutoTargets[featureSelectedPreset].efeatures as AllFeatureKeys[];

  return convertFeaturesForUI(featuresPerPreset);
});

export const exemplarMorphologyAtom = atom<Promise<ExemplarMorphologyDataType | null>>(
  async (get) => {
    const isOptimizationConfig = get(selectedEModelAtom)?.isOptimizationConfig;

    if (isOptimizationConfig) {
      const payload = await get(eModelOptimizationPayloadAtom);
      return payload?.morphologies[0] || null;
    }

    const morphology = await get(eModelMorphologyAtom);

    if (!morphology) return null;

    return convertMorphologyForUI(morphology);
  }
);

export const experimentalTracesAtom = atom<Promise<ExperimentalTracesDataType[] | null>>(
  async (get) => {
    const isOptimizationConfig = get(selectedEModelAtom)?.isOptimizationConfig;

    if (isOptimizationConfig) {
      const payload = await get(eModelOptimizationPayloadAtom);
      return payload?.traces || null;
    }

    const session = get(sessionAtom);
    const eModelExtractionTargetsConfiguration = await get(
      eModelExtractionTargetsConfigurationAtom
    );

    if (!eModelExtractionTargetsConfiguration || !session) return null;

    const traceIds = eModelExtractionTargetsConfiguration.uses.map((trace) => trace['@id']);

    const tracesQuery = getEntityListByIdsQuery('Trace', traceIds);

    const traces = await queryES<Trace>(tracesQuery, session, eModelTracesProjConfig);

    return traces.map((trace) => convertTraceForUI(trace));
  }
);

const eModelTracesProjConfig = {
  project: 'lnmce',
};

/* --------------------------------- EModel --------------------------------- */

export const eModelAtom = atom<Promise<EModel | null>>(async (get) => {
  const selectedEModel = get(selectedEModelAtom);
  if (!selectedEModel) return null;

  const session = get(sessionAtom);
  const eModelId = selectedEModel.id;

  if (!session || !eModelId) return null;

  return fetchResourceById<EModel>(eModelId, session);
});

export const eModelNameAtom = atom<Promise<string | null>>(async (get) => {
  const isOptimizationConfig = get(selectedEModelAtom)?.isOptimizationConfig;
  if (isOptimizationConfig) {
    const eModelOptimization = await get(eModelOptimizationAtom);
    return eModelOptimization?.name || null;
  }

  const eModel = await get(eModelAtom);
  return eModel?.name || null;
});

export const eModelOptimizationAtom = atom<Promise<EModelOptimizationConfigResource | null>>(
  async (get) => {
    const selectedEModel = get(selectedEModelAtom);
    if (!selectedEModel) return null;

    const session = get(sessionAtom);
    const eModelId = selectedEModel.id;

    if (!session || !eModelId) return null;

    return fetchResourceById<EModelOptimizationConfigResource>(eModelId, session);
  }
);

export const refetchOptimizationRevAtom = atom<{}>({});

export const eModelOptimizationRemoteAtom = atom<Promise<EModelOptimizationConfigResource | null>>(
  async (get) => {
    // fetches info after an update to avoid reloading the initial eModelOptimizationAtom
    get(refetchOptimizationRevAtom);
    const selectedEModel = get(selectedEModelAtom);
    if (!selectedEModel) return null;

    const session = get(sessionAtom);
    const eModelId = selectedEModel.id;

    if (!session || !eModelId) return null;

    return fetchResourceById<EModelOptimizationConfigResource>(eModelId, session);
  }
);

export const eModelOptimizationDistributionUrlAtom = atom<Promise<string | null>>(async (get) => {
  const eModelOptimizationRemote = await get(eModelOptimizationRemoteAtom);
  if (!eModelOptimizationRemote) return null;

  return eModelOptimizationRemote.distribution.contentUrl;
});

const eModelOptimizationPayloadAtom = atom<Promise<EModelUIConfig | null>>(async (get) => {
  const eModel = await get(eModelOptimizationAtom);
  const session = get(sessionAtom);

  if (!session || !eModel) return null;

  const url = eModel.distribution.contentUrl;
  return fetchJsonFileByUrl<EModelUIConfig>(url, session);
});

const eModelWorkflowIdAtom = atom<Promise<string | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModel = await get(eModelAtom);

  if (!session || !eModel || !eModel.generation) return null;

  return eModel.generation.activity.followedWorkflow['@id'];
});

/* ----------------------------- EModelWorkflow ----------------------------- */

const eModelWorkflowAtom = atom<Promise<EModelWorkflow | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelWorkflowId = await get(eModelWorkflowIdAtom);

  if (!session || !eModelWorkflowId) return null;

  return fetchResourceById<EModelWorkflow>(eModelWorkflowId, session);
});

/* --------------------------- EModelConfiguration -------------------------- */

const eModelConfigurationIdAtom = atom<Promise<string | null>>(async (get) => {
  const eModelWorkflow = await get(eModelWorkflowAtom);

  if (!eModelWorkflow) return null;

  const modelConfiguration = ensureArray(eModelWorkflow.hasPart).find(
    (part) => part['@type'] === 'EModelConfiguration'
  );

  if (!modelConfiguration) throw new Error('No EModelConfiguration found on EModelWorkflow');

  return modelConfiguration['@id'];
});

export const eModelConfigurationAtom = atom<Promise<EModelConfiguration | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelConfigurationId = await get(eModelConfigurationIdAtom);

  if (!session || !eModelConfigurationId) return null;

  const eModelConfiguration = await fetchResourceById<EModelConfiguration>(
    eModelConfigurationId,
    session
  );
  return eModelConfiguration;
});

export const eModelConfigurationPayloadAtom = atom<Promise<EModelConfigurationPayload | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const eModelConfiguration = await get(eModelConfigurationAtom);

    if (!session || !eModelConfiguration) return null;

    const url = eModelConfiguration.distribution.contentUrl;
    return fetchJsonFileByUrl<EModelConfigurationPayload>(url, session);
  }
);

export const eModelParameterAtom = atom<Promise<EModelConfigurationParameter[] | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const eModelConfigurationPayload = await get(eModelConfigurationPayloadAtom);

    if (!session || !eModelConfigurationPayload) return null;

    return eModelConfigurationPayload.parameters;
  }
);

export const eModelMorphologyAtom = atom<Promise<NeuronMorphology | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelConfiguration = await get(eModelConfigurationAtom);

  if (!session || !eModelConfiguration) return null;

  const morphologyId = eModelConfiguration.uses.find(
    (usage) => usage['@type'] === 'NeuronMorphology'
  )?.['@id'];

  if (!morphologyId) return null;

  return fetchResourceById<NeuronMorphology>(morphologyId, session);
});

export const eModelMechanismsAtom = atom<Promise<MechanismForUI | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  const eModelEditMode = get(eModelEditModeAtom);
  const isOptimizationConfig = get(selectedEModelAtom)?.isOptimizationConfig;

  if (eModelEditMode || isOptimizationConfig) {
    const selectedEModel = get(selectedEModelAtom);
    if (!selectedEModel) throw new Error('No selected e-model to edit');

    type ETypeName = string;
    const { eType } = selectedEModel;

    type EModelMechanismsMapping = Record<ETypeName, MechanismForUI>;
    const payload = await fetchJsonFileById<EModelMechanismsMapping>(eTypeMechanismMapId, session);

    return convertMechanismsForUI(payload[eType]);
  }

  const eModelConfigurationPayload = await get(eModelConfigurationPayloadAtom);

  if (!eModelConfigurationPayload) return null;

  const mechanismsByLocation = groupBy(eModelConfigurationPayload.mechanisms, 'location');

  const data = { processed: mechanismsByLocation, raw: {} } as MechanismForUI;
  return convertMechanismsForUI(data);
});

/* --------------------- ExtractionTargetsConfiguration --------------------- */

const eModelExtractionTargetsConfigurationIdAtom = atom<Promise<string | null>>(async (get) => {
  const eModelWorkflow = await get(eModelWorkflowAtom);

  if (!eModelWorkflow) return null;

  const extractionTargetsConfiguration = ensureArray(eModelWorkflow.hasPart).find(
    (part) => part['@type'] === 'ExtractionTargetsConfiguration'
  );

  if (!extractionTargetsConfiguration)
    throw new Error('No ExtractionTargetsConfiguration found on EModelWorkflow');

  return extractionTargetsConfiguration['@id'];
});

const eModelExtractionTargetsConfigurationAtom = atom<
  Promise<ExtractionTargetsConfiguration | null>
>(async (get) => {
  const session = get(sessionAtom);
  const eModelExtractionTargetsConfigurationId = await get(
    eModelExtractionTargetsConfigurationIdAtom
  );

  if (!session || !eModelExtractionTargetsConfigurationId) return null;

  return fetchResourceById<ExtractionTargetsConfiguration>(
    eModelExtractionTargetsConfigurationId,
    session
  );
});

/* ------------------------------ EModelScript ------------------------------ */

const eModelScriptIdAtom = atom<Promise<string | null>>(async (get) => {
  const eModelWorkflow = await get(eModelWorkflowAtom);

  if (!eModelWorkflow) return null;

  const eModelScriptGenerated = eModelWorkflow.generates.find(
    (generated) => generated['@type'] === 'EModelScript'
  );

  if (!eModelScriptGenerated) throw new Error('No EModelScript found on EModelWorkflow');

  return eModelScriptGenerated['@id'];
});

export const eModelScriptAtom = atom<Promise<EModelScript | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelScriptId = await get(eModelScriptIdAtom);

  if (!session || !eModelScriptId) return null;

  return fetchResourceById<EModelScript>(eModelScriptId, session);
});

/* --------------------------- EModelUIConfigAtom --------------------------- */

export const eModelEditModeAtom = atom(false);

export const eModelUIConfigAtom = atom<Partial<EModelUIConfig> | null>(null);

/* ------------------------- EModelCanonicalMapping ------------------------- */

export const eModelByETypeMappingAtom = atom<Promise<EModelByETypeMappingType | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    const brainRegions = await get(brainRegionsAtom);

    if (!session || !selectedBrainRegion || !brainRegions) return null;

    const eModelsQuery = getEModelQuery();
    const eModels = await queryES<EModelResource>(eModelsQuery, session);
    // pick the e-models compatible with latest structure
    const withGeneration = eModels.filter((eModel) => 'generation' in eModel);
    const withEType = withGeneration.filter((eModel) => 'eType' in eModel);

    const filteredByLocation = withEType.filter((eModel) => {
      // as they don't have brain location, they can be use everywhere
      if (!eModel.brainLocation) return true;

      const eModelBrainRegionId = eModel.brainLocation.brainRegion['@id'];

      if (selectedBrainRegion.id === eModelBrainRegionId) return true;

      const brainRegionForEModel = lodashFind(brainRegions, ['id', eModelBrainRegionId]);

      const isChildren = brainRegionForEModel?.leaves?.includes(selectedBrainRegion.id);
      return isChildren;
    });

    const eModelMenuItems: EModelMenuItem[] = filteredByLocation.map((eModel: EModelResource) => ({
      name: eModel.name,
      id: eModel['@id'] || '',
      eType: eModel.eType || '',
      mType: eModel.mType || '',
      isOptimizationConfig: false,
      rev: eModel._rev,
    }));

    return groupBy<EModelMenuItem>(eModelMenuItems, 'eType');
  }
);

export const reloadListOfOptimizationsAtom = atom({});

export const editedEModelByETypeMappingAtom = atom<Promise<EModelByETypeMappingType | null>>(
  async (get) => {
    get(reloadListOfOptimizationsAtom);
    const session = get(sessionAtom);
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    const brainRegions = await get(brainRegionsAtom);

    if (!session || !selectedBrainRegion || !brainRegions) return null;

    const eModelOptimizationsQuery = getEModelOptimizationConfigQuery();
    const optimizationConfigs = await queryES<EModelOptimizationConfigResource>(
      eModelOptimizationsQuery,
      session
    );

    const eModelMenuItems: EModelMenuItem[] = optimizationConfigs.map((eModel) => ({
      name: eModel.name,
      id: eModel['@id'] ?? '',
      eType: eModel.eType,
      mType: eModel.mType ?? '',
      isOptimizationConfig: true,
      rev: eModel._rev,
    }));

    return groupBy<EModelMenuItem>(eModelMenuItems, 'eType');
  }
);

export const eModelCanBeSavedAtom = atom<boolean>((get) => {
  const selectedEModel = get(selectedEModelAtom);
  const eModelEditMode = get(eModelEditModeAtom);
  const eModelUIConfig = get(eModelUIConfigAtom);

  if (!selectedEModel || !eModelEditMode || !eModelUIConfig) return false;
  if (!eModelUIConfig.name) return false;
  if (selectedEModel?.isOptimizationConfig) return true;

  return eModelUIConfig.name !== selectedEModel.name;
});

export function configIsFulfilled(config: any): config is EModelUIConfig {
  return !!(
    config.name &&
    config.eType &&
    config.mType &&
    config.brainRegionName &&
    config.brainRegionId &&
    config.morphologies?.length === 1 &&
    config.traces?.length &&
    config.parameters
  );
}

export const assembledEModelUIConfigAtom = atom<Promise<EModelUIConfig | null>>(async (get) => {
  const selectedEModel = get(selectedEModelAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);

  const config = {
    mechanism: [await get(eModelMechanismsAtom)],
    traces: await get(experimentalTracesAtom),
    morphologies: [await get(exemplarMorphologyAtom)],
    parameters: await get(simulationParametersAtom),
    name: await get(eModelNameAtom),
    mType: selectedEModel?.mType,
    eType: selectedEModel?.eType,
    brainRegionName: selectedBrainRegion?.title,
    brainRegionId: selectedBrainRegion?.id,
    species: 'mouse',
  };

  return configIsFulfilled(config) ? config : null;
});

selectedEModelAtom.debugLabel = 'selectedEModelAtom';
eModelNameAtom.debugLabel = 'eModelNameAtom';
eModelEditModeAtom.debugLabel = 'eModelEditModeAtom';
eModelUIConfigAtom.debugLabel = 'eModelUIConfigAtom';
simulationParametersAtom.debugLabel = 'simulationParametersAtom';
experimentalTracesAtom.debugLabel = 'experimentalTracesAtom';
exemplarMorphologyAtom.debugLabel = 'exemplarMorphologyAtom';
