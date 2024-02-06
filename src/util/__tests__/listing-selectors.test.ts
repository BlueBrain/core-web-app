import { NO_DATA_STRING } from '@/constants/explore-section/queries';
import {
  selectorFnBasic,
  selectorFnBrainRegion,
  selectorFnContributors,
  selectorFnDate,
  selectorFnLayer,
  selectorFnLayerThickness,
  selectorFnMeanStd,
  selectorFnSpecies,
  selectorFnStatistic,
  selectorFnSynaptic,
  selectorFnMorphologyFeature,
} from '@/util/explore-section/listing-selectors';
import { SynapticPosition, SynapticType } from '@/types/explore-section/fields';
import { formatNumber } from '@/util/common';

describe('Selectors', () => {
  describe('selectorFnBrainRegion', () => {
    it('returns formatted brain region label', () => {
      const result = selectorFnBrainRegion('text', {
        // @ts-ignore
        _source: {
          brainRegion: {
            '@id': 'http://api.brain-map.org/api/v2/data/Structure/648',
            idLabel:
              'http://api.brain-map.org/api/v2/data/Structure/648|Primary motor area, layer 5',
            identifier: 'http://api.brain-map.org/api/v2/data/Structure/648',
            label: 'Primary motor area, layer 5',
          },
        },
      });
      expect(result).toBe('Primary motor area, layer 5');
    });

    it('returns undefined if brain region is not present', () => {
      // @ts-ignore
      const result = selectorFnBrainRegion('text', { _source: {} });
      expect(result).toBeUndefined();
    });
  });

  describe('selectorFnContributors', () => {
    it('returns formatted contributor', () => {
      const result = selectorFnContributors('text', {
        // @ts-ignore
        _source: {
          contributors: [
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
              idLabel: 'https://www.grid.ac/institutes/grid.443970.d|Janelia Research Campus',
              label: 'Janelia Research Campus',
            },
          ],
        },
      });
      expect(result).toBe('Janelia Research Campus');
    });

    it('returns comma separated contributors when multiple', () => {
      const result = selectorFnContributors('text', {
        // @ts-ignore
        _source: {
          contributors: [
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
              idLabel: 'https://www.grid.ac/institutes/grid.443970.d|Janelia Research Campus',
              label: 'Contributor 1',
            },
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
              idLabel: 'https://www.grid.ac/institutes/grid.443970.d|Janelia Research Campus',
              label: 'Contributor 2',
            },
          ],
        },
      });
      expect(result).toBe('Contributor 1, Contributor 2');
    });

    it('returns undefined if contributors are not present', () => {
      // @ts-ignore
      const result = selectorFnContributors('text', { _source: {} });
      expect(result).toBeUndefined();
    });

    it('returns sorted contributors when multiple', () => {
      const result = selectorFnContributors('text', {
        // @ts-ignore
        _source: {
          contributors: [
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
              idLabel: 'https://www.grid.ac/institutes/grid.443970.d/Janelia Research Campus',
              label: 'Janelia Research Campus',
            },
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
              idLabel:
                'https://www.grid.ac/institutes/grid.443970.d/École Polytechnique Fédérale de Lausanne',
              label: 'École Polytechnique Fédérale de Lausanne',
            },
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Person', 'http://www.w3.org/ns/prov#Agent'],
              idLabel: 'https://www.grid.ac/institutes/grid.443970.d/Bernardo Selva',
              label: 'Bernardo Selva',
            },
            {
              '@id': 'https://www.grid.ac/institutes/grid.443970.d',
              '@type': ['http://schema.org/Person', 'http://www.w3.org/ns/prov#Agent'],
              idLabel: 'https://www.grid.ac/institutes/grid.443970.d/Amanda Tores',
              label: 'Amanda Tores',
            },
          ],
        },
      });
      expect(result).toBe(
        'École Polytechnique Fédérale de Lausanne, Janelia Research Campus, Amanda Tores, Bernardo Selva'
      );
    });
  });

  describe('selectorFnStatistic', () => {
    it('returns formatted statistic value', () => {
      const result = selectorFnStatistic(
        // @ts-ignore
        {
          series: [
            {
              statistic: 'data point',
              unit: 'neurons/mm³',
              value: 68750,
            },
            {
              statistic: 'N',
              unit: 'dimensionless',
              value: 37,
            },
            {
              statistic: 'mean',
              unit: 'neurons/mm³',
              value: 68750.0,
            },
          ],
        },
        'mean'
      );
      expect(result).toBe('68,750');
    });

    it('returns an empty string if source is not present', () => {
      const result = selectorFnStatistic(
        // @ts-ignore
        {
          series: [
            {
              statistic: 'data point',
              unit: 'neurons/mm³',
              value: 68750,
            },
            {
              statistic: 'N',
              unit: 'dimensionless',
              value: 37,
            },
          ],
        },
        'mean'
      );
      expect(result).toBe('');
    });

    it('returns an empty string if statistic is not found', () => {
      const result = selectorFnStatistic(
        // @ts-ignore
        {
          series: [
            {
              statistic: 'data point',
              unit: 'neurons/mm³',
              value: 68750,
            },
            {
              statistic: 'N',
              unit: 'dimensionless',
              value: 37,
            },
            {
              statistic: 'mean',
              unit: 'neurons/mm³',
              value: 68750.0,
            },
          ],
        },
        'nonexistent'
      );
      expect(result).toBe('');
    });
  });

  describe('selectorFnDate', () => {
    it('returns formatted date', () => {
      const result = selectorFnDate('2023-12-12');
      expect(result).toBe('12.12.2023');
    });

    it('returns an empty string if date is invalid', () => {
      const result = selectorFnDate('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('selectorFnBasic', () => {
    it('returns text value if provided', () => {
      const result = selectorFnBasic('Hello, World!');
      expect(result).toBe('Hello, World!');
    });

    it('returns NO_DATA_STRING if text is undefined', () => {
      const result = selectorFnBasic(undefined);
      expect(result).toBe(NO_DATA_STRING);
    });
  });

  describe('selectorFnMeanStd', () => {
    it('returns correct value if both mean and std are present', () => {
      const result = selectorFnMeanStd('', {
        // @ts-ignore
        _source: {
          series: [
            {
              statistic: 'standard deviation',
              unit: 'neurons/mm³',
              value: 100,
            },
            {
              statistic: 'N',
              unit: 'dimensionless',
              value: 37,
            },
            {
              statistic: 'mean',
              unit: 'neurons/mm³',
              value: 687,
            },
          ],
        },
      });
      expect(result).toBe('687 ± 100');
    });

    it('returns correct value if only mean is present', () => {
      const result = selectorFnMeanStd('', {
        // @ts-ignore
        _source: {
          series: [
            {
              statistic: 'N',
              unit: 'dimensionless',
              value: 37,
            },
            {
              statistic: 'mean',
              unit: 'neurons/mm³',
              value: 687,
            },
          ],
        },
      });
      expect(result).toBe('687');
    });

    it('returns correct value if mean is not present', () => {
      const result = selectorFnMeanStd('', {
        // @ts-ignore
        _source: {
          series: [
            {
              statistic: 'standard deviation',
              unit: 'neurons/mm³',
              value: 100,
            },
            {
              statistic: 'N',
              unit: 'dimensionless',
              value: 37,
            },
          ],
        },
      });
      expect(result).toBe('');
    });
  });

  describe('selectorFnLayerThickness', () => {
    it('returns correct value if thickness is present', () => {
      const result = selectorFnLayerThickness('', {
        // @ts-ignore
        _source: {
          layerThickness: {
            label: '250 µm  (N = 1)',
            nValue: 1,
            unit: 'µm ',
            value: 250,
          },
        },
      });
      expect(result).toBe('250');
    });

    it('returns empty string if layer thickness not present', () => {
      const result = selectorFnLayerThickness('', {
        // @ts-ignore
        _source: {},
      });
      expect(result).toBe('');
    });
  });

  describe('selectorFnLayer', () => {
    it('returns correct value if single layer', () => {
      const result = selectorFnLayer('', {
        // @ts-ignore
        _source: {
          layer: [{ '@id': 'id', idLabel: 'idlabel', identifier: 'id', label: 'layer' }],
        },
      });
      expect(result).toBe('layer');
    });

    it('returns correct value if multiple layers', () => {
      const result = selectorFnLayer('', {
        // @ts-ignore
        _source: {
          layer: [
            { '@id': 'id', idLabel: 'idlabel', identifier: 'id', label: 'layer1' },
            { '@id': 'id', idLabel: 'idlabel', identifier: 'id', label: 'layer2' },
          ],
        },
      });
      expect(result).toBe('layer1, layer2');
    });

    it('returns empty string if not present', () => {
      const result = selectorFnLayer('', {
        // @ts-ignore
        _source: {},
      });
      expect(result).toBe('');
    });
  });

  describe('selectorFnSpecies', () => {
    it('returns correct value if single layer', () => {
      const result = selectorFnSpecies({
        identifier: 'http://purl.obolibrary.org/obo/NCBITaxon_10090',
        label: 'Mus musculus',
      });
      expect(result).toBe('Mus musculus');
    });

    it('returns empty string if not present', () => {
      const result = selectorFnSpecies(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('selectorFnSynaptic', () => {
    it('returns correct value for presynaptic brain region', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          preSynapticPathway: [
            {
              '@id':
                'http://bbp.epfl.ch/neurosciencegraph/ontologies/mtypes/R0J7pXALR2O5lS5mVIo9mA',
              about: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
              label: 'SO_OLM',
            },
            {
              '@id': 'http://purl.obolibrary.org/obo/UBERON_0003881',
              about: 'https://neuroshapes.org/BrainRegion',
              idLabel: 'http://purl.obolibrary.org/obo/UBERON_0003881|CA1 field of hippocampus',
              identifier: 'http://purl.obolibrary.org/obo/UBERON_0003881',
              label: 'CA1 field of hippocampus',
            },
          ],
        },
        SynapticPosition.Pre,
        SynapticType.BrainRegion
      );
      expect(result).toBe('CA1 field of hippocampus');
    });

    it('returns empty string if presynaptic brain region is not present', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          preSynapticPathway: [
            {
              '@id':
                'http://bbp.epfl.ch/neurosciencegraph/ontologies/mtypes/R0J7pXALR2O5lS5mVIo9mA',
              about: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
              label: 'SO_OLM',
            },
          ],
        },
        SynapticPosition.Pre,
        SynapticType.BrainRegion
      );
      expect(result).toBe('');
    });

    it('returns correct value for presynaptic cell type', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          preSynapticPathway: [
            {
              '@id':
                'http://bbp.epfl.ch/neurosciencegraph/ontologies/mtypes/R0J7pXALR2O5lS5mVIo9mA',
              about: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
              label: 'SO_OLM',
            },
            {
              '@id': 'http://purl.obolibrary.org/obo/UBERON_0003881',
              about: 'https://neuroshapes.org/BrainRegion',
              idLabel: 'http://purl.obolibrary.org/obo/UBERON_0003881|CA1 field of hippocampus',
              identifier: 'http://purl.obolibrary.org/obo/UBERON_0003881',
              label: 'CA1 field of hippocampus',
            },
          ],
        },
        SynapticPosition.Pre,
        SynapticType.CellType
      );
      expect(result).toBe('SO_OLM');
    });

    it('returns empty string if presynaptic cell type is empty', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          preSynapticPathway: [
            {
              '@id': 'http://purl.obolibrary.org/obo/UBERON_0003881',
              about: 'https://neuroshapes.org/BrainRegion',
              idLabel: 'http://purl.obolibrary.org/obo/UBERON_0003881|CA1 field of hippocampus',
              identifier: 'http://purl.obolibrary.org/obo/UBERON_0003881',
              label: 'CA1 field of hippocampus',
            },
          ],
        },
        SynapticPosition.Pre,
        SynapticType.CellType
      );
      expect(result).toBe('');
    });

    it('returns correct value for postsynaptic brain region', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          postSynapticPathway: [
            {
              '@id': 'http://purl.obolibrary.org/obo/UBERON_0003881',
              about: 'https://neuroshapes.org/BrainRegion',
              idLabel: 'http://purl.obolibrary.org/obo/UBERON_0003881|CA1 field of hippocampus',
              identifier: 'http://purl.obolibrary.org/obo/UBERON_0003881',
              label: 'CA1 field of hippocampus',
            },
            {
              '@id':
                'http://bbp.epfl.ch/neurosciencegraph/ontologies/mtypes/UWn6SVr6TMKkvqSTtMPzrA',
              about: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
              label: 'SP_PC',
            },
          ],
        },
        SynapticPosition.Post,
        SynapticType.BrainRegion
      );
      expect(result).toBe('CA1 field of hippocampus');
    });

    it('returns empty value if postsynaptic brain region is not present', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          postSynapticPathway: [
            {
              '@id':
                'http://bbp.epfl.ch/neurosciencegraph/ontologies/mtypes/UWn6SVr6TMKkvqSTtMPzrA',
              about: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
              label: 'SP_PC',
            },
          ],
        },
        SynapticPosition.Post,
        SynapticType.BrainRegion
      );
      expect(result).toBe('');
    });

    it('returns correct value for postsynaptic cell type', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          postSynapticPathway: [
            {
              '@id': 'http://purl.obolibrary.org/obo/UBERON_0003881',
              about: 'https://neuroshapes.org/BrainRegion',
              idLabel: 'http://purl.obolibrary.org/obo/UBERON_0003881|CA1 field of hippocampus',
              identifier: 'http://purl.obolibrary.org/obo/UBERON_0003881',
              label: 'CA1 field of hippocampus',
            },
            {
              '@id':
                'http://bbp.epfl.ch/neurosciencegraph/ontologies/mtypes/UWn6SVr6TMKkvqSTtMPzrA',
              about: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
              label: 'SP_PC',
            },
          ],
        },
        SynapticPosition.Post,
        SynapticType.CellType
      );
      expect(result).toBe('SP_PC');
    });

    it('returns empty value if postsynaptic cell type is not present', () => {
      const result = selectorFnSynaptic(
        // @ts-ignore
        {
          postSynapticPathway: [
            {
              '@id': 'http://purl.obolibrary.org/obo/UBERON_0003881',
              about: 'https://neuroshapes.org/BrainRegion',
              idLabel: 'http://purl.obolibrary.org/obo/UBERON_0003881|CA1 field of hippocampus',
              identifier: 'http://purl.obolibrary.org/obo/UBERON_0003881',
              label: 'CA1 field of hippocampus',
            },
          ],
        },
        SynapticPosition.Post,
        SynapticType.CellType
      );
      expect(result).toBe('');
    });
  });

  describe('selectorFnMorphologyFeature', () => {
    const mockSource = {
      featureSeries: [
        {
          compartment: 'NeuronMorphology',
          label: 'Total Depth',
          statistic: 'mean',
          unit: 'dimensionless',
          value: 853.0,
        },
        {
          compartment: 'Axon',
          label: 'Partition Asymmetry',
          statistic: 'standard deviation',
          unit: 'dimensionless',
          value: 0.34878757070556377,
        },
        {
          compartment: 'NeuronMorphology',
          label: 'Total Length',
          statistic: 'mean',
          unit: 'μm',
          value: 13944.989401578903,
        },
        {
          compartment: 'Axon',
          label: 'Section Strahler Orders',
          statistic: 'maximum',
          unit: 'dimensionless',
          value: 5.0,
        },
        {
          compartment: 'Axon',
          label: 'Total Length',
          statistic: 'maximum',
          unit: 'μm',
          value: 9600.45951640606,
        },
        {
          compartment: 'Soma',
          label: 'Soma Radius',
          statistic: 'minimum',
          unit: 'μm',
          value: 5.46871709813711,
        },
        {
          compartment: 'BasalDendrite',
          label: 'Total Length',
          statistic: 'mean',
          unit: 'μm',
          value: 4344.529885172844,
        },
        {
          compartment: 'BasalDendrite',
          label: 'Section Strahler Orders',
          statistic: 'standard deviation',
          unit: 'dimensionless',
          value: 0.8123269504088237,
        },
        {
          compartment: 'ApicalDendrite',
          label: 'Total Length',
          statistic: 'minimum',
          unit: 'μm',
          value: 0.0,
        },
        {
          compartment: 'ApicalDendrite',
          label: 'Total Length',
          statistic: 'maximum',
          unit: 'μm',
          value: '0.0',
        },
      ],
    };

    it('returns formatted statistic value if present', () => {
      const result = selectorFnMorphologyFeature(
        // @ts-ignore
        mockSource,
        'NeuronMorphology',
        'Total Length',
        'mean',
        true
      );
      expect(result).toBe(`${formatNumber(13944.989401578903)} μm`);
    });

    it('returns formatted statistic value without unit if showUnits is false', () => {
      const result = selectorFnMorphologyFeature(
        // @ts-ignore
        mockSource,
        'NeuronMorphology',
        'Total Length',
        'mean',
        false
      );
      expect(result).toBe(formatNumber(13944.989401578903));
    });

    it('returns double the value for Soma Radius', () => {
      const result = selectorFnMorphologyFeature(
        // @ts-ignore
        mockSource,
        'Soma',
        'Soma Radius',
        'minimum',
        true
      );
      expect(result).toBe(`${formatNumber(10.94)} μm`);
    });

    it('returns NO_DATA_STRING if statistic is not found', () => {
      // @ts-ignore
      const result = selectorFnMorphologyFeature(mockSource, 'compartment', 'nonexistent', 'mean');
      expect(result).toBe(NO_DATA_STRING);
    });

    it('returns NO_DATA_STRING for 0 value', () => {
      const result = selectorFnMorphologyFeature(
        // @ts-ignore
        mockSource,
        'ApicalDendrite',
        'Total Length',
        'minimum',
        true
      );
      expect(result).toBe(NO_DATA_STRING);
    });

    it('returns NO DATA STRING when value is not a number', () => {
      const result = selectorFnMorphologyFeature(
        // @ts-ignore
        mockSource,
        'ApicalDendrite',
        'Total Length',
        'maximum',
        true
      );
      expect(result).toBe(NO_DATA_STRING);
    });
  });
});
