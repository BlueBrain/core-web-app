import { inferenceMorphRelevantRule, inferenceSimilarityModels } from '@/config';

type RelevantRulesProps = {
  [key: string]: string;
};

export type SimalirityModelsProps = {
  id: string;
  title: string;
};

export const SIMILARITY_MODELS: SimalirityModelsProps[] = inferenceSimilarityModels;

export const RELEVANT_RULES: RelevantRulesProps = {
  [inferenceMorphRelevantRule.id]: 'Morphology',
};
