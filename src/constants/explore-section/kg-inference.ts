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
  'https://bbp.epfl.ch/neurosciencegraph/data/ac5885c8-bb70-4336-ae7f-3e1425356fe8':
    'Shape-based morphology recommendation',
  'https://bbp.epfl.ch/neurosciencegraph/data/70e8e757-1834-420c-bcc1-37ea850ddfe3':
    'Location-based morphology recommendation',
};
