import lodashFind from 'lodash/find';

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
} from '@/types/e-model';
import {
  spikeEventFeatures,
  spikeShapeFeatures,
  voltageFeatures,
  featureDescriptionsMap,
} from '@/constants/cell-model-assignment/e-model';

const NOT_AVAILABLE_STR = 'Data not available';

export function convertRemoteParamsForUI(
  remoteParams: EModelConfigurationParameter[]
): SimulationParameter {
  const ra = lodashFind(remoteParams, ['name', 'Ra'])?.value;
  const temp = lodashFind(remoteParams, ['name', 'celsius'])?.value;
  const voltage = lodashFind(remoteParams, ['name', 'v_init'])?.value;

  if ([ra, temp, voltage].some((value) => !value || Array.isArray(value))) {
    throw new Error('Failed converting remote simulation parameter');
  }

  return {
    'Temperature (°C)': temp as number,
    Ra: ra as number,
    'Initial voltage': voltage as number,
    'LJP (liquid junction potential)': 14.0,
  };
}

export function convertMorphologyForUI(
  remoteMorphology: NeuronMorphology
): ExemplarMorphologyDataType {
  return {
    '@id': remoteMorphology['@id'],
    name: remoteMorphology.name,
    description: NOT_AVAILABLE_STR,
    brainLocation: NOT_AVAILABLE_STR,
    mType: NOT_AVAILABLE_STR,
    contributor: NOT_AVAILABLE_STR,
  };
}

export function convertTracesForUI(traces: Trace[]): ExperimentalTracesDataType[] {
  return traces.map((trace) => ({
    '@id': trace['@id'],
    cellName: trace.name,
    mType: NOT_AVAILABLE_STR,
    eType: NOT_AVAILABLE_STR,
    description: NOT_AVAILABLE_STR,
    eCodes: trace.stimulus.map((s) => s.stimulusType.label as ECode),
    subjectSpecies: trace.subject.species.label,
  }));
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
