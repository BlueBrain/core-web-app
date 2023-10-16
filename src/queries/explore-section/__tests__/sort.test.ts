import buildESSort from '@/queries/explore-section/sorters';

describe('Sorter query builder unit tests', () => {
  it('should return correct query if non nested', () => {
    const sorter = buildESSort({ field: 'name', order: 'desc' });
    expect(sorter?.toJSON()).toEqual({
      'name.keyword': {
        order: 'desc',
        unmapped_type: 'keyword',
      },
    });
  });

  it('should return correct query if nested', () => {
    const sorter = buildESSort({ field: 'sem', order: 'desc' });
    expect(sorter?.toJSON()).toEqual({
      'series.value': {
        order: 'desc',
        mode: 'min',
        nested: {
          path: 'series',
          filter: {
            term: {
              'series.statistic.keyword': 'standard error of the mean',
            },
          },
        },
      },
    });
  });
});
