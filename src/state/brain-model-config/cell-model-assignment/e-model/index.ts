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
  ExtractionTargetsConfigurationPayload,
  FeatureParameterGroup,
  FeaturePresetName,
  NeuronMorphology,
  SimulationParameter,
  Trace,
  EModelByETypeMappingType,
  SelectedEModelType,
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
import { getEModelQuery, getEntityListByIdsQuery } from '@/queries/es';
import { eTypeMechanismMapId, featureAutoTargets } from '@/constants/cell-model-assignment/e-model';
import { brainRegionsAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { BRAIN_REGION_URI_BASE } from '@/util/brain-hierarchy';

export const selectedEModelAtom = atom<SelectedEModelType | null>(null);

export const eModelRemoteParamsLoadedAtom = atom(false);

export const refetchTriggerAtom = atom<{}>({});

export const simulationParametersAtom = atom<Promise<SimulationParameter | null>>(async (get) => {
  const remoteParameters = await get(eModelParameterAtom);

  if (!remoteParameters) return null;

  const simParams = convertRemoteParamsForUI(remoteParameters);
  return simParams;
});

export const featureSelectedPresetAtom = atom<FeaturePresetName>('firing_pattern');

export const featureParametersAtom = atom<Promise<FeatureParameterGroup | null>>(async (get) => {
  const eModelEditMode = get(eModelEditModeAtom);

  if (eModelEditMode) {
    const featureSelectedPreset = get(featureSelectedPresetAtom);
    const featuresPerPreset = featureAutoTargets[featureSelectedPreset]
      .efeatures as AllFeatureKeys[];

    return convertFeaturesForUI(featuresPerPreset);
  }

  const session = get(sessionAtom);
  const eModelExtractionTargetsConfiguration = await get(eModelExtractionTargetsConfigurationAtom);

  if (!eModelExtractionTargetsConfiguration || !session) return null;

  const { contentUrl } = eModelExtractionTargetsConfiguration.distribution;
  const payload = await fetchJsonFileByUrl<ExtractionTargetsConfigurationPayload>(
    contentUrl,
    session
  );
  const featureNames = payload.targets.map((f) => f.efeature);
  return convertFeaturesForUI(featureNames);
});

export const exemplarMorphologyAtom = atom<Promise<ExemplarMorphologyDataType | null>>(
  async (get) => {
    const morphology = await get(eModelMorphologyAtom);

    if (!morphology) return null;

    return convertMorphologyForUI(morphology);
  }
);

export const experimentalTracesAtom = atom<Promise<ExperimentalTracesDataType[] | null>>(
  async (get) => {
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

// Accessing the project from where the current data of e-model is located
// TODO: remove this when the data is moved to mmb-point-neuron-framework-model
const eModelProjConfig = {
  project: 'mmb-emodels-for-synthesized-neurons',
};

const eModelTracesProjConfig = {
  project: 'lnmce',
};

/* --------------------------------- EModel --------------------------------- */

export const eModelAtom = atom<Promise<EModel | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelId = await get(selectedEModelAtom)?.id;

  if (!session || !eModelId) return null;

  return fetchResourceById<EModel>(eModelId, session, eModelProjConfig);
});

const eModelWorkflowIdAtom = atom<Promise<string | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModel = await get(eModelAtom);

  if (!session || !eModel) return null;

  return eModel.generation.activity.followedWorkflow['@id'];
});

/* ----------------------------- EModelWorkflow ----------------------------- */

const eModelWorkflowAtom = atom<Promise<EModelWorkflow | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelWorkflowId = await get(eModelWorkflowIdAtom);

  if (!session || !eModelWorkflowId) return null;

  return fetchResourceById<EModelWorkflow>(eModelWorkflowId, session, eModelProjConfig);
});

/* --------------------------- EModelConfiguration -------------------------- */

const eModelConfigurationIdAtom = atom<Promise<string | null>>(async (get) => {
  const eModelWorkflow = await get(eModelWorkflowAtom);

  if (!eModelWorkflow) return null;

  const modelConfiguration = eModelWorkflow.hasPart.find(
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
    session,
    eModelProjConfig
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

  return fetchResourceById<NeuronMorphology>(morphologyId, session, eModelProjConfig);
});

export const eModelMechanismsAtom = atom<Promise<MechanismForUI | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  const eModelEditMode = get(eModelEditModeAtom);

  if (eModelEditMode) {
    const selectedEModel = get(selectedEModelAtom);
    if (!selectedEModel) throw new Error('No selected e-model to edit');

    type ETypeName = string;
    const eType: ETypeName = selectedEModel.name;

    type EModelMechanismsMapping = Record<ETypeName, MechanismForUI>;
    const payload = await fetchJsonFileById<EModelMechanismsMapping>(eTypeMechanismMapId, session);

    return convertMechanismsForUI(payload[eType]);
  }

  const eModelConfigurationPayload = await get(eModelConfigurationPayloadAtom);

  if (!eModelConfigurationPayload) return null;

  const mechanismsByLocation = groupBy(
    eModelConfigurationPayload.mechanisms,
    'location'
  ) as MechanismForUI;

  return convertMechanismsForUI(mechanismsByLocation);
});

/* --------------------- ExtractionTargetsConfiguration --------------------- */

const eModelExtractionTargetsConfigurationIdAtom = atom<Promise<string | null>>(async (get) => {
  const eModelWorkflow = await get(eModelWorkflowAtom);

  if (!eModelWorkflow) return null;

  const extractionTargetsConfiguration = eModelWorkflow.hasPart.find(
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
    session,
    eModelProjConfig
  );
});

/* --------------------------- EModelUIConfigAtom --------------------------- */

export const eModelEditModeAtom = atom(false);

export const eModelUIConfigAtom = atom<Partial<EModelUIConfig> | null>({});

/* ------------------------- EModelCanonicalMapping ------------------------- */

export const eModelByETypeMappingAtom = atom<Promise<EModelByETypeMappingType | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    const brainRegions = await get(brainRegionsAtom);

    if (!session || !selectedBrainRegion || !brainRegions) return null;

    const eModelsQuery = getEModelQuery();
    const eModels = await queryES<EModel>(eModelsQuery, session, eModelProjConfig);
    // pick the e-models compatible with latest structure
    const withGeneration = eModels.filter((eModel) => 'generation' in eModel);

    const filteredByLocation = withGeneration.filter((eModel) => {
      // as they don't have brain location, they can be use everywhere
      if (!('brainLocation' in eModel)) return true;

      const eModelBrainRegionCollapsedId = eModel.brainLocation?.brainRegion['@id'].replace(
        `${BRAIN_REGION_URI_BASE}/`,
        ''
      );
      const brainRegionForEModel = lodashFind(brainRegions, ['id', eModelBrainRegionCollapsedId]);

      const selectedBrainRegionExpandedId = `${BRAIN_REGION_URI_BASE}/${selectedBrainRegion.id}`;
      const isChildren = brainRegionForEModel?.leaves?.includes(selectedBrainRegionExpandedId);
      return isChildren;
    });

    const byEType: EModelByETypeMappingType = groupBy<EModel>(filteredByLocation, 'etype');
    return byEType;
  }
);

export const eModelCanBeSavedAtom = atom<Promise<boolean>>(async (get) => {
  const selectedEModel = get(selectedEModelAtom);
  const eModelEditMode = get(eModelEditModeAtom);
  const eModelUIConfig = get(eModelUIConfigAtom);

  if (!selectedEModel || !eModelEditMode || !eModelUIConfig) return false;
  if (!eModelUIConfig.eModelName) return false;

  return eModelUIConfig.eModelName !== selectedEModel.name;
});
