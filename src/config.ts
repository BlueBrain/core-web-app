import { env } from '@/env.mjs';

export const basePath = env.NEXT_PUBLIC_BASE_PATH;

export const isServer = typeof window === 'undefined';

export const sentryDsn = env.NEXT_PUBLIC_SENTRY_DSN;

export const bbsMlBaseUrl = env.NEXT_PUBLIC_BBS_ML_BASE_URL;
export const bbsMlPrivateUrl = env.NEXT_PUBLIC_BBS_ML_PRIVATE_BASE_URL;
export const cellSvcBaseUrl = env.NEXT_PUBLIC_CELL_SVC_BASE_URL;
export const feedbackUrl = env.NEXT_PUBLIC_FEEDBACK_URL;
export const kgInferenceBaseUrl = env.NEXT_PUBLIC_KG_INFERENCE_BASE_URL;
export const thumbnailGenerationBaseUrl = env.NEXT_PUBLIC_THUMBNAIL_GENERATION_BASE_URL;
export const synthesisUrl = env.NEXT_PUBLIC_SYNTHESIS_URL;

export const blueNaasUrl = env.NEXT_PUBLIC_BLUE_NAAS_URL;

export const meModelAnalysisSvc = {
  wsUrl: env.NEXT_PUBLIC_ME_MODEL_ANALYSIS_WS_URL,
};

const ORG = env.NEXT_PUBLIC_NEXUS_DEFAULT_ORG;
const PROJECT = env.NEXT_PUBLIC_NEXUS_DEFAULT_PROJECT;

export const nexus = {
  url: env.NEXT_PUBLIC_NEXUS_URL,
  org: ORG,
  project: PROJECT,
  defaultIdBaseUrl: `https://bbp.epfl.ch/data/${ORG}/${PROJECT}`,
  legacyIdBaseUrl: 'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations',
  defaultESViewId: 'https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset',
  defaultContext: 'https://bbp.neuroshapes.org',
};

export const defaultModelRelease = {
  name: env.NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_NAME,
  description: env.NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_DESCRIPTION,
  id: env.NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_ID,
};

export const ontologyBaseUrl = env.NEXT_PUBLIC_ONTOLOGY_BASE_URL;

export const neuroShapesBaseUrl = env.NEXT_PUBLIC_NEUROSHAPES_BASE_URL;

export const brainRegionOntologyResource = {
  org: env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ORG,
  project: env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_PROJECT,
  id: env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ID,
  tag: env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_TAG,
};

export const atlasReleaseResource = {
  id: env.NEXT_PUBLIC_ATLAS_RELEASE_RESOURCE_ID,
};

export const atlasESView = {
  org: env.NEXT_PUBLIC_ATLAS_ES_VIEW_ORG,
  project: env.NEXT_PUBLIC_ATLAS_ES_VIEW_PROJECT,
  id: env.NEXT_PUBLIC_ATLAS_ES_VIEW_ID,
};

export const inferenceSimilarityModels = [
  {
    id: env.NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_ID,
    title: env.NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_TITLE,
  },
];

export const inferenceMorphRelevantRule = {
  id: env.NEXT_PUBLIC_INFERENCE_MORPH_RELEVANT_RULE_ID,
};

export const cellCompositionFile = {
  org: env.NEXT_PUBLIC_CELL_COMPOSITION_ORG,
  project: env.NEXT_PUBLIC_CELL_COMPOSITION_PROJECT,
  id: env.NEXT_PUBLIC_CELL_COMPOSITION_ID,
  tag: env.NEXT_PUBLIC_CELL_COMPOSITION_TAG,
};

export const synParamAssignmentResource = {
  id: env.NEXT_PUBLIC_SYN_PARAM_ASSIGNMENT_RESOURCE_ID,
};

export const synParamResource = {
  id: env.NEXT_PUBLIC_SYN_PARAM_RESOURCE_ID,
};

export const eTypeMechanismMap = {
  id: env.NEXT_PUBLIC_ETYPE_MECHANISM_MAP_ID,
};

export const connInitialRulesFile = {
  id: env.NEXT_PUBLIC_CONN_INITIAL_RULES_FILE_ID,
};

export const connInitialParamsFile = {
  id: env.NEXT_PUBLIC_CONN_INITIAL_PARAMS_FILE_ID,
};

export const licensesESView = {
  org: env.NEXT_PUBLIC_LICENSE_ES_VIEW_ORG,
  project: env.NEXT_PUBLIC_LICENSE_ES_VIEW_PROJECT,
  viewId: env.NEXT_PUBLIC_LICENSE_ES_VIEW_ID,
};

export const autoSaveDebounceInterval = 10000;

export const virtualLabApi = {
  url: env.NEXT_PUBLIC_VIRTUAL_LAB_API_URL,
};
