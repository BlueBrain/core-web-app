import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  selectorFnStatisticDetail,
  semSelectorFn,
  subjectAgeSelectorFn,
} from '@/util/explore-section/selector-functions';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';

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
      ).toBe(0.029);
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
});
