import { atom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { ExploreSectionResponse, ESResponseRaw } from '@/types/explore-section/resources';
import { TotalHits, Aggregations } from '@/types/explore-section/fields';
import { SortState } from '@/types/explore-section/application';
import { Filter } from '@/components/Filter/types';
import fetchDataQuery from '@/queries/explore-section/data';
import { fetchRules } from '@/api/generalization';
import sessionAtom from '@/state/session';
import fetchEsResourcesByType from '@/api/explore-section/resources';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { PAGE_SIZE, PAGE_NUMBER } from '@/constants/explore-section/list-views';
import { typeToColumns } from '@/state/explore-section/type-to-columns';
import { RuleOuput } from '@/types/explore-section/kg-inference';

type InferenceOptionsState = { [key: string]: boolean };
type CheckboxState = { [rule: string]: InferenceOptionsState };

const RELEVANT_RULES: string[] = ['Shape-based morphology recommendation','Location-based morphology recommendation'];

// Function to generate the initial state for a given rule and inference options
function generateInitialState(rule: any, inferenceOptions: any): InferenceOptionsState {
  const initialState: InferenceOptionsState = {};
  Object.keys(inferenceOptions).forEach((key: string) => {
    initialState[key] = false;
  });
  return initialState;
}


export const columnKeyToFilter = (key: string): Filter => {
  const fieldConfig = LISTING_CONFIG[key];

  switch (fieldConfig.filter) {
    case 'checkList':
      return {
        field: key,
        type: 'checkList',
        value: [],
        aggregationType: 'buckets',
      };
    case 'checkListInference':
      return {
        field: key,
        type: 'checkListInference',
        value: [],
        aggregationType: 'buckets',
      };
    case 'dateRange':
      return {
        field: key,
        type: 'dateRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case 'valueRange':
      return {
        field: key,
        type: 'valueRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case 'valueOrRange':
      return {
        field: key,
        type: 'valueOrRange',
        value: null,
        aggregationType: 'buckets',
      };
    default:
      return {
        field: key,
        aggregationType: null,
        type: null,
        value: null,
      };
  }
};

export const pageSizeAtom = atom<number>(PAGE_SIZE);

export const pageNumberAtom = atom<number>(PAGE_NUMBER);

export const searchStringAtom = atom<string>('');

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const typeAtom = atom<string | undefined>(undefined);

export const columnKeysAtom = atom<string[]>((get) => {
  const type = get(typeAtom);

  if (!type) return [];

  return typeToColumns[type as string];
});

export const activeColumnsAtom = atomWithDefault(
  (get) => ['index', ...get(columnKeysAtom)] // TODO: There is no 'index' for Simulation Campaigns
);

export const filtersAtom = atomWithDefault<Filter[]>((get) => {
  const columnsKeys = get(columnKeysAtom);

  return columnsKeys.map((colKey) => columnKeyToFilter(colKey));
});

export const queryAtom = atom<object>((get) => {
  const type = get(typeAtom);
  const searchString = get(searchStringAtom);
  const pageNumber = get(pageNumberAtom);
  const pageSize = get(pageSizeAtom);
  const sortState = get(sortStateAtom);
  const filters = get(filtersAtom);

  if (!type || !filters) {
    return null;
  }

  return fetchDataQuery(pageSize, pageNumber, filters, type, sortState, searchString);
});

const refetchCounterAtom = atom<number>(0);

export const triggerRefetchAtom = atom(null, async (_get, set) => {
  set(refetchCounterAtom, (counter) => counter + 1);
});

export const queryResponseAtom = atom<Promise<ExploreSectionResponse> | null>((get) => {
  const session = get(sessionAtom);
  const query = get(queryAtom);

  get(refetchCounterAtom);

  if (!session) return null;

  return fetchEsResourcesByType(session.accessToken, query);
});

export const dataAtom = atom<Promise<ESResponseRaw[]>>(
  async (get) => (await get(queryResponseAtom))?.hits ?? []
);

export const totalAtom = atom<Promise<TotalHits | undefined>>(async (get) => {
  const { total } = (await get(queryResponseAtom)) ?? { total: { relation: 'eq', value: 0 } };

  return total;
});

export const aggregationsAtom = atom<Promise<Aggregations | undefined>>(async (get) => {
  const response = await get(queryResponseAtom);

  return response?.aggs;
});

export const rulesResponseAtom = atom<Promise<RuleOuput[]> | null>((get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return fetchRules(session);
});

export const resourceBasedRulesInitialStateAtom = atom<any | null>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;
  
  const rules = await get(rulesResponseAtom)
  
  if (!session || !rules) return null;

  const ruleBasedInitialState: CheckboxState = {};

  // Filter rules based on the specified names
  const relevantRules = filter(rules, (rule) => RELEVANT_RULES.includes(rule.name));

  console.log("rules initial state atom relevant rules", relevantRules);
  // Generate initial state for the relevant rules
  relevantRules.forEach((rule) => {
    const inferenceOptions = find(rule.inputParameters, { name: 'IgnoreModelsParameter' })?.payload?.values;
    ruleBasedInitialState[rule.id] = generateInitialState(rule, inferenceOptions);
  });
  console.log("rule based initial state return - ruleBasedInitialState", ruleBasedInitialState);

  return ruleBasedInitialState;
});
