import lodashFind from 'lodash/find';
import mergeWith from 'lodash/mergeWith';

import {
  AllFeatureKeys,
  ECode,
  MechanismForUI,
  ExemplarMorphologyDataType,
  ExperimentalTracesDataType,
  FeatureCategory,
  FeatureItem,
  FeatureParameterGroup,
  NeuronMorphology,
  SimulationParameter,
  SpikeEventFeatureKeys,
  SpikeShapeFeatureKeys,
  Trace,
  VoltageFeatureKeys,
  EModelByETypeMappingType,
  EModelRemoteParameters,
} from '@/types/e-model';
import {
  spikeEventFeatures,
  spikeShapeFeatures,
  voltageFeatures,
  featureDescriptionsMap,
} from '@/constants/cell-model-assignment/e-model';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';

export function convertRemoteParamsForUI(
  remoteParams: EModelRemoteParameters
): SimulationParameter {
  const ra = lodashFind(remoteParams.parameters, ['name', 'Ra'])?.value;
  const temp = lodashFind(remoteParams.parameters, ['name', 'celsius'])?.value;
  const voltage = lodashFind(remoteParams.parameters, ['name', 'v_init'])?.value;
  const { maxGenerations } = remoteParams;

  if (
    [ra, temp, voltage, maxGenerations].some(
      (value) => !value || Array.isArray(value) || Number.isNaN(value)
    )
  ) {
    throw new Error('Failed converting remote simulation parameter');
  }

  return {
    'Temperature (°C)': Number(temp),
    Ra: Number(ra),
    'Initial voltage': Number(voltage),
    'LJP (liquid junction potential)': 14.0,
    'Max optimisation generation': maxGenerations || 10,
  };
}

export function convertMorphologyForUI(
  remoteMorphology: NeuronMorphology | ReconstructedNeuronMorphology
): ExemplarMorphologyDataType {
  const swcDistribution = remoteMorphology.distribution.find(
    (d) => d.encodingFormat === 'application/swc'
  );
  if (!swcDistribution) throw new Error('No swc in distribution');

  const commonProps = {
    '@id': remoteMorphology['@id'],
    '@type': remoteMorphology['@type'],
    name: remoteMorphology.name,
    description: remoteMorphology?.description || NO_DATA_STRING,
    isPlaceholder: remoteMorphology['@type'].includes('SynthesizedNeuronMorphology'),
    distribution: swcDistribution,
  };

  if ('objectOfStudy' in remoteMorphology) {
    // morph from e-model pipeline - NeuronMorphology
    return {
      ...commonProps,
      brainLocation: remoteMorphology?.brainLocation?.brainRegion?.label || NO_DATA_STRING,
      mType: NO_DATA_STRING,
      contributor: remoteMorphology?.contribution?.agent?.name || NO_DATA_STRING,
    };
  }

  return {
    // morph from search table - ReconstructedNeuronMorphology
    ...commonProps,
    brainLocation: remoteMorphology?.brainRegion?.label || NO_DATA_STRING,
    mType: remoteMorphology?.mType?.label || NO_DATA_STRING,
    contributor: remoteMorphology?.contributors?.map((c) => c.label).join(' '),
  };
}

export function convertTraceForUI(trace: Trace | ExperimentalTrace): ExperimentalTracesDataType {
  const commonProps = {
    '@id': trace['@id'],
    '@type': trace['@type'],
    cellName: trace.name,
    distribution: trace.distribution,
  };

  if ('stimulus' in trace) {
    // trace from e-model pipeline
    return {
      ...commonProps,
      mType: NO_DATA_STRING,
      eType: NO_DATA_STRING,
      description: NO_DATA_STRING,
      eCodes: trace.stimulus.map((s) => s.stimulusType.label as ECode),
      subjectSpecies: trace.subject?.species?.label || NO_DATA_STRING,
    };
  }

  return {
    // trace from search table
    ...commonProps,
    mType: NO_DATA_STRING,
    eType: NO_DATA_STRING,
    description: trace?.description || NO_DATA_STRING,
    eCodes: [],
    subjectSpecies: NO_DATA_STRING,
  };
}

export function convertFeaturesForUI(features: AllFeatureKeys[]): FeatureParameterGroup {
  const featuresInCategoryMap = {
    'Spike shape': [...spikeShapeFeatures] as SpikeShapeFeatureKeys[],
    'Spike event': [...spikeEventFeatures] as SpikeEventFeatureKeys[],
    Voltage: [...voltageFeatures] as VoltageFeatureKeys[],
  };

  const getFeaturesFromCategory = (
    categoryName: FeatureCategory,
    featureNameList: AllFeatureKeys[]
  ) => {
    const featureInCategoryNames: AllFeatureKeys[] = featuresInCategoryMap[categoryName];
    const descriptionsInCategory = featureDescriptionsMap[categoryName];
    return featureInCategoryNames.map(
      (featureInCategoryName): FeatureItem<AllFeatureKeys> => ({
        efeature: featureInCategoryName,
        selected: !!featureNameList.includes(featureInCategoryName),
        uuid: crypto.randomUUID(),
        displayName: featureInCategoryName,
        // TODO: fix this types
        // @ts-ignore
        description: descriptionsInCategory[featureInCategoryName],
      })
    );
  };

  return {
    'Spike shape': getFeaturesFromCategory(
      'Spike shape',
      features
    ) as FeatureItem<SpikeShapeFeatureKeys>[],
    'Spike event': getFeaturesFromCategory(
      'Spike event',
      features
    ) as FeatureItem<SpikeEventFeatureKeys>[],
    Voltage: getFeaturesFromCategory('Voltage', features) as FeatureItem<VoltageFeatureKeys>[],
  };
}

export function convertMechanismsForUI(
  mechanismsGroupedByLocation: MechanismForUI
): MechanismForUI {
  return mechanismsGroupedByLocation;
}

export function mergeEModelsAndOptimizations(
  optimizations: EModelByETypeMappingType | null,
  eModels: EModelByETypeMappingType | null
) {
  if (!eModels || !optimizations) return eModels || optimizations;

  function customizer(objValue: EModelByETypeMappingType, srcValue: EModelByETypeMappingType) {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      return [...srcValue, ...objValue];
    }
    return objValue;
  }

  const merged = {};

  mergeWith(merged, optimizations, eModels, customizer);
  return merged;
}
