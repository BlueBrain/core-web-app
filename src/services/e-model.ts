import lodashFind from 'lodash/find';

import {
  AllFeatureKeys,
  ECode,
  EModelConfigurationParameter,
  EModelFeature,
  ExemplarMorphologyDataType,
  ExperimentalTracesDataType,
  FeatureCategory,
  FeatureItem,
  FeatureParameterGroup,
  MechanismForUI,
  NeuronMorphology,
  SimulationParameter,
  SpikeEventFeatureKeys,
  SpikeShapeFeatureKeys,
  SubCellularModelScript,
  Trace,
  VoltageFeatureKeys,
} from '@/types/e-model';
import {
  spikeEventFeatures,
  spikeShapeFeatures,
  voltageFeatures,
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

export function convertFeaturesForUI(features: EModelFeature[]): FeatureParameterGroup {
  const featuresInCategoryMap = {
    'Spike shape': [...spikeShapeFeatures] as SpikeShapeFeatureKeys[],
    'Spike event': [...spikeEventFeatures] as SpikeEventFeatureKeys[],
    Voltage: [...voltageFeatures] as VoltageFeatureKeys[],
  };

  const getFeaturesFromCategory = (categoryName: FeatureCategory, featureList: EModelFeature[]) => {
    const featureNamesInCategory: AllFeatureKeys[] = featuresInCategoryMap[categoryName];
    return featureList
      .filter((feature) => featureNamesInCategory.includes(feature.efeature))
      .map(
        (feature): FeatureItem<AllFeatureKeys> => ({
          ...feature,
          selected: true,
          uuid: crypto.randomUUID(),
          displayName: `${feature.efeature}_${feature.amplitude}`,
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
  subCellularModelScripts: SubCellularModelScript[]
): MechanismForUI[] {
  return subCellularModelScripts.map((s) => ({ name: s.name, description: s.description }));
}
