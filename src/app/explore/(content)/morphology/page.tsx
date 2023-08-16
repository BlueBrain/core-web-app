import { getServerSession } from 'next-auth';
import filter from 'lodash/filter';
import find from 'lodash/find';
import Wrapper from './wrapper';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { fetchRules } from '@/api/generalization';
import { RELEVANT_RULES } from '@/constants/explore-section/kg-inference';
import {
  InferenceOptionsState,
  RuleWithOptionsProps,
  PayLoadValues,
} from '@/types/explore-section/kg-inference';

const TYPE = 'https://neuroshapes.org/NeuronMorphology';

// Function to generate the initial state for a given rule and inference options
function generateInitialState(inferenceOptions: PayLoadValues): InferenceOptionsState {
  const initialState: InferenceOptionsState = {};
  Object.keys(inferenceOptions).forEach((key: string) => {
    initialState[key] = false;
  });
  return initialState;
}

export default async function MorphologyListingPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const rules = await fetchRules(session, TYPE);

  const rulesWithOptions: RuleWithOptionsProps = {};

  // Create a Set of keys from RELEVANT_RULES for efficient membership checks
  const relevantRuleKeys = new Set(Object.keys(RELEVANT_RULES));

  // Filter rules based on the specified names
  const relevantRules = filter(rules, (rule) => relevantRuleKeys.has(rule.id));

  // Generate initial state for the relevant rules
  relevantRules.forEach((rule) => {
    const inferenceOptions = find(rule.inputParameters, { name: 'IgnoreModelsParameter' })?.payload
      ?.values;
    if (typeof inferenceOptions === 'object')
      rulesWithOptions[rule.id] = generateInitialState(inferenceOptions);
  });
  
  return <Wrapper rulesWithOptions={rulesWithOptions} TYPE={TYPE} />;
}
