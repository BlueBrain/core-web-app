import buildFilters, { getFilterESBuilder } from '@/queries/explore-section/filters';
import { Filter } from '@/components/Filter/types';

const checklistFilter: Filter = {
  field: 'brainRegion',
  type: 'checkList',
  value: ['brainRegion1'],
  aggregationType: 'buckets',
};

const valueRangeFilter: Filter = {
  field: 'neuronDensity',
  type: 'valueRange',
  value: {
    gte: 2,
    lte: 5,
  },
  aggregationType: 'stats',
};

describe('Filters elastic builder', () => {
  it('should build correct terms filter', () => {
    const builder = getFilterESBuilder(checklistFilter);
    expect(builder?.toJSON()).toEqual({
      terms: { 'brainRegion.label.keyword': ['brainRegion1'] },
    });
  });

  it('should build correct range filter when both gte lte', () => {
    const builder = getFilterESBuilder(valueRangeFilter);
    expect(builder?.toJSON()).toEqual({
      range: {
        'neuronDensity.value': {
          gte: 2,
          lte: 5,
        },
      },
    });
  });

  it('should build correct range filter when only gte', () => {
    const valueRangeFilterWithoutLTE: Filter = {
      field: 'neuronDensity',
      type: 'valueRange',
      // @ts-ignore
      value: {
        gte: 2,
      },
      aggregationType: 'stats',
      title: 'Neuron Density',
    };

    const builder = getFilterESBuilder(valueRangeFilterWithoutLTE);
    expect(builder?.toJSON()).toEqual({
      range: {
        'neuronDensity.value': {
          gte: 2,
        },
      },
    });
  });

  it('should build correct range filter when nested field', () => {
    const nestedValueRangeFilter: Filter = {
      field: 'meanstd',
      type: 'valueRange',
      value: {
        gte: 2,
        lte: 5,
      },
      aggregationType: 'stats',
    };

    const builder = getFilterESBuilder(nestedValueRangeFilter);
    expect(builder?.toJSON()).toEqual({
      nested: {
        path: 'series',
        query: {
          bool: {
            must: [
              {
                term: {
                  'series.statistic.keyword': 'mean',
                },
              },
              {
                range: {
                  'series.value': {
                    gte: 2,
                    lte: 5,
                  },
                },
              },
            ],
          },
        },
      },
    });
  });

  it('should build correct date range filter when both lte and gte', () => {
    const dateRangeFilter: Filter = {
      field: 'createdAt',
      type: 'dateRange',
      value: {
        gte: new Date('1994-04-13'),
        lte: new Date('1994-04-15'),
      },
      aggregationType: 'stats',
    };
    const builder = getFilterESBuilder(dateRangeFilter);
    expect(builder?.toJSON()).toEqual({
      range: {
        createdAt: {
          gte: '1994-04-13',
          lte: '1994-04-15',
        },
      },
    });
  });
});

describe('test buildFilters functionality', () => {
  it('should build correct terms filter', () => {
    const builder = buildFilters('https://neuroshapes.org/BoutonDensity', [
      checklistFilter,
      valueRangeFilter,
    ]);
    expect(builder?.toJSON()).toEqual({
      bool: {
        must: [
          {
            term: {
              '@type.keyword': 'https://neuroshapes.org/BoutonDensity',
            },
          },
          {
            term: {
              deprecated: false,
            },
          },
          {
            terms: {
              'brainRegion.label.keyword': ['brainRegion1'],
            },
          },
          {
            range: {
              'neuronDensity.value': {
                gte: 2,
                lte: 5,
              },
            },
          },
        ],
      },
    });
  });
});
