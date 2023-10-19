import { Filter } from '@/components/Filter/types';
import buildAggs, { getAggESBuilder } from '@/queries/explore-section/aggs';

const checklistFilter: Filter = {
  field: 'brainRegion',
  type: 'checkList',
  value: ['brainRegion1'],
  aggregationType: 'buckets',
};

const valueRangeFilter: Filter = {
  field: 'layerThickness',
  type: 'valueRange',
  value: {
    gte: 2,
    lte: 5,
  },
  aggregationType: 'stats',
};

describe('getFilterESBuilder tests', () => {
  it('should return correct buckets builder', () => {
    const aggBuilder = getAggESBuilder(checklistFilter);
    expect(aggBuilder?.toJSON()).toEqual({
      brainRegion: {
        terms: {
          field: 'brainRegion.@id.keyword',
          size: 100,
        },
        aggs: {
          label: {
            terms: {
              field: 'brainRegion.label.keyword',
              size: 1,
            },
          },
        },
      },
    });
  });

  it('should return correct stats builder for non nested filter', () => {
    const aggBuilder = getAggESBuilder(valueRangeFilter);
    expect(aggBuilder?.toJSON()).toEqual({
      layerThickness: {
        stats: {
          field: 'layerThickness.value',
        },
      },
    });
  });

  it('should return correct stats builder for nested filter', () => {
    const nestedValueRangeFilter: Filter = {
      field: 'meanstd',
      type: 'valueRange',
      value: {
        gte: 2,
        lte: 5,
      },
      aggregationType: 'stats',
    };

    const aggBuilder = getAggESBuilder(nestedValueRangeFilter);
    expect(aggBuilder?.toJSON()).toEqual({
      meanstd: {
        aggs: {
          meanstd: {
            aggs: {
              mean: {
                stats: {
                  field: 'series.value',
                },
              },
            },
            filter: {
              term: {
                'series.statistic.keyword': 'mean',
              },
            },
          },
        },
        nested: {
          path: 'series',
        },
      },
    });
  });
});

describe('buildAggs unit tests', () => {
  it('should return the correct chain of aggs', () => {
    const aggBuilder = buildAggs([checklistFilter, valueRangeFilter]);
    expect(aggBuilder.toJSON()).toEqual({
      aggs: {
        brainRegion: {
          terms: {
            field: 'brainRegion.@id.keyword',
            size: 100,
          },
          aggs: {
            label: {
              terms: {
                field: 'brainRegion.label.keyword',
                size: 1,
              },
            },
          },
        },
        layerThickness: {
          stats: {
            field: 'layerThickness.value',
          },
        },
      },
    });
  });
});
