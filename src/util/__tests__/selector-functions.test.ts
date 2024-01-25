import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  selectorFnStatisticDetail,
  semSelectorFn,
  subjectAgeSelectorFn,
  selectorFnNeuriteFeature,
} from '@/util/explore-section/selector-functions';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';
import { formatNumber } from '@/util/common';

describe('selectorFunctions', () => {
  describe('subjectAgeSelectorFn', () => {
    it('returns formatted subject age if present', () => {
      expect(
        // @ts-ignore
        subjectAgeSelectorFn({
          subject: {
            '@type': 'Subject',
            age: {
              minValue: 20,
              maxValue: 30,
              period: 'Post-natal',
              unitCode: 'days',
              label: '',
              unit: '',
            },
            species: {
              '@id': 'NCBITaxon:10090',
              label: 'Mus musculus',
            },
          },
        })
      ).toBe('20 to 30 days Post-natal');
    });

    it('returns formatted range if min and max values are present', () => {
      expect(
        // @ts-ignore
        subjectAgeSelectorFn({
          subject: {
            '@type': 'Subject',
            age: {
              period: 'Post-natal',
              unitCode: 'days',
              value: 21,
              label: '',
              unit: '',
            },
            species: {
              '@id': 'NCBITaxon:10090',
              label: 'Mus musculus',
            },
          },
        })
      ).toBe('21 days Post-natal');
    });

    test('returns undefined if subject age is not present', () => {
      // @ts-ignore
      expect(subjectAgeSelectorFn({})).toBe(NO_DATA_STRING);
    });
  });

  describe('mTypeSelectorFn', () => {
    it('returns MType label if present', () => {
      expect(
        // @ts-ignore
        mTypeSelectorFn({
          annotation: [
            {
              '@type': ['Annotation', 'MTypeAnnotation'],
              hasBody: {
                '@id': 'ilx:0738214',
                '@type': ['MType', 'AnnotationBody'],
                label: 'ATN_TC',
              },
              name: 'M-type Annotation',
            },
          ],
        })
      ).toBe('ATN_TC');
    });

    it('returns Undefined label if m-type not present', () => {
      expect(
        // @ts-ignore
        mTypeSelectorFn({})
      ).toBe(NO_DATA_STRING);
    });
  });

  describe('eTypeSelectorFn', () => {
    it('returns EType label if present', () => {
      expect(
        // @ts-ignore
        eTypeSelectorFn({
          annotation: [
            {
              '@type': ['Annotation', 'ETypeAnnotation'],
              hasBody: {
                '@id': 'ilx:0738214',
                '@type': ['EType', 'AnnotationBody'],
                label: 'ATN_TC',
              },
              name: 'E-type Annotation',
            },
          ],
        })
      ).toBe('ATN_TC');
    });

    it('returns Undefined label if e-type not present', () => {
      expect(
        // @ts-ignore
        eTypeSelectorFn({})
      ).toBe(NO_DATA_STRING);
    });
  });

  describe('semSelectorFn', () => {
    it('returns correct sem value', () => {
      expect(
        // @ts-ignore
        semSelectorFn({
          series: [
            {
              statistic: 'mean',
              unitCode: 'synapses/connection',
              value: 1.19,
            },
            {
              statistic: 'standard error of the mean',
              unitCode: 'synapses/connection',
              value: 0.028997860479848495,
            },
          ],
        })
      ).toBe(0.028997860479848495);
    });

    it('returns undefined if sem not present', () => {
      expect(
        // @ts-ignore
        semSelectorFn({})
      ).toBe(NO_DATA_STRING);
    });
  });

  describe('selectorFnStatisticDetail', () => {
    it('returns correct statistical value', () => {
      expect(
        selectorFnStatisticDetail(
          // @ts-ignore
          {
            series: [
              {
                statistic: 'mean',
                unitCode: 'synapses/connection',
                value: 1.19,
              },
              {
                statistic: 'standard error of the mean',
                unitCode: 'synapses/connection',
                value: 0.028997860479848495,
              },
            ],
          },
          'mean'
        )
      ).toBe('1.19 ');
    });

    it('returns empty string if statistical value is not present', () => {
      expect(
        selectorFnStatisticDetail(
          // @ts-ignore
          {
            series: [
              {
                statistic: 'mean',
                unitCode: 'synapses/connection',
                value: 1.19,
              },
              {
                statistic: 'standard error of the mean',
                unitCode: 'synapses/connection',
                value: 0.028997860479848495,
              },
            ],
          },
          'N'
        )
      ).toBe(NO_DATA_STRING);
    });
  });

  describe('selectorFnNeuriteFeature', () => {
    const mockSource = {
      neuriteFeature: [
        {
          '@type': 'Axon',
          cumulatedLength: {
            unitCode: 'μm',
            value: 13702.434000086363,
          },
          longestBranchLength: {
            unitCode: 'μm',
            value: 5148.730704634398,
          },
          longestBranchNumberOfNodes: 2397,
          name: 'axon features',
          numberOfProjections: 133,
        },
        {
          '@type': 'BasalDendrite',
          cumulatedLength: {
            unitCode: 'μm',
            value: 4623.512799949973,
          },
          longestBranchLength: {
            unitCode: 'μm',
            value: 203.55953010233796,
          },
          longestBranchNumberOfNodes: 137,
          name: 'basal dendrite features',
          numberOfProjections: 45,
        },
      ],
    };

    it('returns formatted cumulatedLength for Axon', () => {
      // @ts-ignore
      const result = selectorFnNeuriteFeature(mockSource, 'Axon', 'cumulatedLength');
      expect(result).toBe(`${formatNumber(13702.434000086363)} μm`);
    });

    it('returns formatted longestBranchLength for Axon', () => {
      // @ts-ignore
      const result = selectorFnNeuriteFeature(mockSource, 'Axon', 'longestBranchLength');
      expect(result).toBe(`${formatNumber(5148.730704634398)} μm`);
    });

    it('returns formatted cumulatedLength for BasalDendrite', () => {
      // @ts-ignore
      const result = selectorFnNeuriteFeature(mockSource, 'BasalDendrite', 'cumulatedLength');
      expect(result).toBe(`${formatNumber(4623.512799949973)} μm`);
    });

    it('returns formatted longestBranchLength for BasalDendrite', () => {
      // @ts-ignore
      const result = selectorFnNeuriteFeature(mockSource, 'BasalDendrite', 'longestBranchLength');
      expect(result).toBe(`${formatNumber(203.55953010233796)} μm`);
    });

    it('returns NO_DATA_STRING if featureType is not found', () => {
      // @ts-ignore
      const result = selectorFnNeuriteFeature(mockSource, 'NonexistentType', 'cumulatedLength');
      expect(result).toBe(NO_DATA_STRING);
    });

    it('returns NO_DATA_STRING if field is not found', () => {
      // @ts-ignore
      const result = selectorFnNeuriteFeature(mockSource, 'Axon', 'nonexistentField');
      expect(result).toBe(NO_DATA_STRING);
    });
  });
});
