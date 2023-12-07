export const BASE_URL = 'https://kg-inference-api.kcp.bbp.epfl.ch';

type RelevantRulesProps = {
  [key: string]: string;
};

export type SimalirityModelsProps = {
  id: string;
  title: string;
};

export const SIMILARITY_MODELS: SimalirityModelsProps[] = [
  {
    id: 'https://bbp.epfl.ch/neurosciencegraph/data/9d64dc0d-07d1-4624-b409-cdc47ccda212',
    title: 'Generalize by brain region similarity in the BBP ontology hierarchy',
  },
];

export const RELEVANT_RULES: RelevantRulesProps = {
  'https://bbp.epfl.ch/neurosciencegraph/data/abb1949e-dc16-4719-b43b-ff88dabc4cb8': 'Morphology',
};
