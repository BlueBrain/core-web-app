import { selectOptions, SelectOption } from '../__utils__/searchOptions';
import filterAndSortBasedOnPosition from '@/util/filterAndSortBasedOnPosition';

const queryString = 'topography';

describe('test fuzzy search hook', () => {
  let result: Array<SelectOption> = [];

  beforeAll(() => {
    result = filterAndSortBasedOnPosition<SelectOption>(queryString, selectOptions);
  });

  test('result include the right items', () => {
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      label: 'Brain topography',
      value: 'Brain topography',
    });
    expect(result).toContainEqual({
      label: 'topography',
      value: 'topography',
    });
  });

  test('result are in the right order', () => {
    const queryStringIndex = result.findIndex((o: SelectOption) => o.value === queryString);

    expect(queryStringIndex).toBe(0);
  });

  test('result not include wrong items', () => {
    expect(result).not.toContain({
      label: 'Neuroscientist (Baltimore, Md.)',
      value: 'Neuroscientist (Baltimore, Md.)',
    });
  });
});
