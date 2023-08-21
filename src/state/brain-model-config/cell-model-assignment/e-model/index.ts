import { atom } from 'jotai';

import {
  EModel,
  EModelConfiguration,
  EModelConfigurationParameter,
  EModelConfigurationPayload,
  EModelMenuItem,
  EModelWorkflow,
  ExemplarMorphologyDataType,
  ExperimentalTracesDataType,
  ExtractionTargetsConfiguration,
  ExtractionTargetsConfigurationPayload,
  FeatureParameterGroup,
  MechanismForUI,
  NeuronMorphology,
  SimulationParameter,
  SubCellularModelScript,
  Trace,
} from '@/types/e-model';
import { fetchJsonFileByUrl, fetchResourceById, queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';
import {
  convertRemoteParamsForUI,
  convertMorphologyForUI,
  convertTracesForUI,
  convertFeaturesForUI,
  convertMechanismsForUI,
} from '@/services/e-model';
import { getEntityListByIdsQuery } from '@/queries/es';

export const selectedEModelAtom = atom<EModelMenuItem | null>(null);

export const eModelRemoteParamsLoadedAtom = atom(false);

export const refetchTriggerAtom = atom<{}>({});

export const simulationParametersAtom = atom<Promise<SimulationParameter | null>>(async (get) => {
  const remoteParameters = await get(eModelParameterAtom);

  if (!remoteParameters) return null;

  const simParams = convertRemoteParamsForUI(remoteParameters);
  return simParams;
});

export const featureParametersAtom = atom<Promise<FeatureParameterGroup | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelExtractionTargetsConfiguration = await get(eModelExtractionTargetsConfigurationAtom);

  if (!eModelExtractionTargetsConfiguration || !session) return null;

  const { contentUrl } = eModelExtractionTargetsConfiguration.distribution;
  const payload = await fetchJsonFileByUrl<ExtractionTargetsConfigurationPayload>(
    contentUrl,
    session
  );

  return convertFeaturesForUI(payload.targets);
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

    return convertTracesForUI(traces);
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

const eModelIdAtom = atom<Promise<string | null>>(
  async () => 'https://bbp.epfl.ch/neurosciencegraph/data/ff131327-704b-451e-a412-bef7ccf9daf0'
);

/* --------------------------------- EModel --------------------------------- */

const eModelWorkflowIdAtom = atom<Promise<string | null>>(async (get) => {
  const session = get(sessionAtom);
  const eModelId = await get(eModelIdAtom);

  if (!session || !eModelId) return null;

  const eModel = await fetchResourceById<EModel>(eModelId, session, eModelProjConfig);

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

export const eModelParameterAtom = atom<Promise<EModelConfigurationParameter[] | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const eModelConfiguration = await get(eModelConfigurationAtom);

    if (!session || !eModelConfiguration) return null;

    const url = eModelConfiguration.distribution.contentUrl;
    const fileContent = await fetchJsonFileByUrl<EModelConfigurationPayload>(url, session);
    return fileContent.parameters;
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

export const eModelSubCellularModelScriptAtom = atom<Promise<MechanismForUI[] | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const eModelConfiguration = await get(eModelConfigurationAtom);

    if (!session || !eModelConfiguration) return null;

    const subCellularModelScriptIds = eModelConfiguration.uses
      .filter((usage) => usage['@type'] === 'SubCellularModelScript')
      .map((m) => m['@id']);

    const query = getEntityListByIdsQuery('SubCellularModelScript', subCellularModelScriptIds);
    const subCellularModelScriptList = await queryES<SubCellularModelScript>(
      query,
      session,
      eModelProjConfig
    );
    return convertMechanismsForUI(subCellularModelScriptList);
  }
);

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
