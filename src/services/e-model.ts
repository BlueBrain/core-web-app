import lodashFind from 'lodash/find';
import mergeWith from 'lodash/mergeWith';

import {
  AllFeatureKeys,
  ECode,
  EModelConfigurationParameter,
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

const NOT_AVAILABLE_STR = 'Data not available';

export function convertRemoteParamsForUI(
  remoteParams: EModelConfigurationParameter[]
): SimulationParameter {
  const ra = lodashFind(remoteParams, ['name', 'Ra'])?.value;
  const temp = lodashFind(remoteParams, ['name', 'celsius'])?.value;
  const voltage = lodashFind(remoteParams, ['name', 'v_init'])?.value;

  if ([ra, temp, voltage].some((value) => !value || Array.isArray(value) || !Number(value))) {
    throw new Error('Failed converting remote simulation parameter');
  }

  return {
    'Temperature (°C)': Number(temp),
    Ra: Number(ra),
    'Initial voltage': Number(voltage),
    'LJP (liquid junction potential)': 14.0,
  };
}

export function convertMorphologyForUI(
  remoteMorphology: NeuronMorphology | ReconstructedNeuronMorphology
): ExemplarMorphologyDataType {
  const commonProps = {
    '@id': remoteMorphology['@id'],
    name: remoteMorphology.name,
  };

  if ('objectOfStudy' in remoteMorphology) {
    // morph from e-model pipeline
    return {
      ...commonProps,
      description: NOT_AVAILABLE_STR,
      brainLocation: NOT_AVAILABLE_STR,
      mType: NOT_AVAILABLE_STR,
      contributor: remoteMorphology.contribution.agent.name || NOT_AVAILABLE_STR,
    };
  }

  return {
    // morph from search table
    ...commonProps,
    description: remoteMorphology.description || NOT_AVAILABLE_STR,
    brainLocation: remoteMorphology.brainRegion.label,
    mType: NOT_AVAILABLE_STR,
    contributor: remoteMorphology.contributors?.map((c) => c.label).join(' '),
  };
}

export function convertTraceForUI(trace: Trace | ExperimentalTrace): ExperimentalTracesDataType {
  const commonProps = {
    '@id': trace['@id'],
    cellName: trace.name,
  };

  if ('stimulus' in trace) {
    // trace from e-model pipeline
    return {
      ...commonProps,
      mType: NOT_AVAILABLE_STR,
      eType: NOT_AVAILABLE_STR,
      description: NOT_AVAILABLE_STR,
      eCodes: trace.stimulus.map((s) => s.stimulusType.label as ECode),
      subjectSpecies: trace.subject?.species?.label || NOT_AVAILABLE_STR,
    };
  }

  return {
    // trace from search table
    ...commonProps,
    mType: NOT_AVAILABLE_STR,
    eType: NOT_AVAILABLE_STR,
    description: trace?.description || NOT_AVAILABLE_STR,
    eCodes: [],
    subjectSpecies: NOT_AVAILABLE_STR,
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
