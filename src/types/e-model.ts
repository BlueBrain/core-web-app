import { MModelMenuItem } from './m-model';
import { BrainLocation, ContributionEntity, Distribution, Entity, ResourceMetadata } from './nexus';
import {
  eCodes,
  mechanismLocations,
  presetNames,
  spikeEventFeatures,
  spikeShapeFeatures,
  voltageFeatures,
} from '@/constants/cell-model-assignment/e-model';

export interface EModelMenuItem {
  name: string;
  id: string;
  eType: string;
  mType: string;
  isOptimizationConfig: boolean;
  rev: number;
}

export interface MEModelMenuItem {
  [mTypeKey: string]: {
    mTypeInfo: MModelMenuItem;
    eTypeInfo: EModelMenuItem[];
  };
}

export type SimulationParameterKeys =
  | 'Temperature (°C)'
  | 'Ra'
  | 'Initial voltage'
  | 'LJP (liquid junction potential)'
  | 'Validation threshold';
export type SimulationParameter = Record<SimulationParameterKeys, number>;

export interface ExemplarMorphologyDataType {
  '@id': string;
  name: string;
  description: string;
  brainLocation: string;
  mType: string;
  contributor: string;
}

export interface ExperimentalTracesDataType {
  '@id': string;
  cellName: string;
  mType: string;
  eType: string;
  description: string;
  eCodes: ECode[];
  subjectSpecies: string;
}

type Generation = {
  '@type': 'Generation';
  activity: {
    '@type': 'Activity';
    followedWorkflow: {
      '@id': string;
      '@type': 'EModelWorkflow';
    };
  };
};

/* --------------------------------- EModel --------------------------------- */

export type EModelType = 'EModel';

export interface EModel extends EModelCommonProps {
  '@type': ['Entity', EModelType];
  description: string;
  distribution: Distribution[];
  generation: Generation;
  seed: number;
  brainLocation?: BrainLocation;
  subject: {
    '@type': 'Subject';
    species: {
      '@id': string;
      label: string;
    };
  };
}

export interface EModelResource extends ResourceMetadata, EModel {}

interface EModelCommonProps extends Entity {
  '@context': 'https://bbp.neuroshapes.org';
  annotation: [
    {
      '@type': ['ETypeAnnotation', 'Annotation'];
      hasBody: {
        '@type': ['EType', 'AnnotationBody'];
        label: string;
      };
      name: string;
    }
  ];
  contribution: ContributionEntity;
  distribution: Distribution | Distribution[];
  emodel: string;
  etype: string;
  iteration: string;
  name: string;
  objectOfStudy: EModelObjectOfStudy;
}

interface EModelObjectOfStudy {
  '@id': 'http://bbp.epfl.ch/neurosciencegraph/taxonomies/objectsofstudy/singlecells';
  '@type': 'nsg:ObjectOfStudy';
  label: 'Single Cell';
}

/* ----------------------------- EModelWorkflow ----------------------------- */

export type EModelWorkflowType = 'EModelWorkflow';

export interface EModelWorkflow extends EModelCommonProps {
  '@type': ['Entity', EModelWorkflowType];
  hasPart: [
    {
      '@id': string;
      '@type': ExtractionTargetsConfigurationType;
    },
    {
      '@id': string;
      '@type': EModelPipelineSettingsType;
    },
    {
      '@id': string;
      '@type': EModelConfigurationType;
    }
  ];
  distribution: Distribution;
  state: string;
}

export interface EModelWorkflowResource extends ResourceMetadata, EModelWorkflow {}

/* --------------------------- EModelConfiguration -------------------------- */

export type EModelConfigurationType = 'EModelConfiguration';

export interface EModelConfiguration extends EModelCommonProps {
  '@type': ['Entity', EModelConfigurationType];
  uses: {
    '@id': string;
    '@type': NeuronMorphologyType | SubCellularModelScriptType;
  }[];
  distribution: Distribution;
}

export interface EModelConfigurationResource extends ResourceMetadata, EModelConfiguration {}

export interface EModelConfigurationMechanism {
  name: string;
  stochastic?: boolean;
  location?: MechanismLocation;
  version?: null;
}

export interface EModelConfigurationDistribution {
  name: string;
  function: string | null;
  soma_ref_location: number;
  parameters?: string[];
}

export interface EModelConfigurationParameter {
  name: string;
  value: number | number[];
  location: string;
  mechanism?: string;
  distribution?: string;
}

export interface EModelConfigurationMorphology {
  name: string;
  format: 'asc' | 'swc';
  path: string;
  seclist_names: null;
  secarray_names: null;
  section_index: null;
}

export interface EModelConfigurationPayload {
  mechanisms: EModelConfigurationMechanism[];
  distributions: EModelConfigurationDistribution[];
  parameters: EModelConfigurationParameter[];
  morphology: EModelConfigurationMorphology;
  morph_modifiers: null;
}

/* ------------------------------ >> Mechanism ------------------------------ */

export type MechanismLocation = (typeof mechanismLocations)[number];

export type MechanismForUI = {
  processed: Record<MechanismLocation, EModelConfigurationMechanism[]>;
  raw: any; // pass the whole params recipe to launch the workflow
};

/* ------------------------- EModelPipelineSettings ------------------------- */

export type EModelPipelineSettingsType = 'EModelPipelineSettings';

export interface EModelPipelineSettings extends EModelCommonProps {
  '@type': ['Entity', EModelPipelineSettingsType];
  distribution: Distribution;
}

export interface EModelPipelineSettingsResource extends ResourceMetadata, EModelPipelineSettings {}

export interface EModelPipelineSettingsPayload extends Record<string, number> {
  validation_threshold: number;
}

/* --------------------- ExtractionTargetsConfiguration --------------------- */

export type ExtractionTargetsConfigurationType = 'ExtractionTargetsConfiguration';

export interface ExtractionTargetsConfiguration extends EModelCommonProps {
  '@type': ['Entity', ExtractionTargetsConfigurationType];
  uses: {
    '@id': string;
    '@type': TraceType;
  }[];
  distribution: Distribution;
}

export interface ExtractionTargetsConfigurationResource
  extends ResourceMetadata,
    ExtractionTargetsConfiguration {}

export interface EModelFeature {
  efeature: AllFeatureKeys;
  protocol: ECode;
  amplitude: number;
  tolerance: number;
  efeature_name: string | null;
  efel_settings: {
    stim_start?: number;
    stim_end?: number;
    strict_stiminterval?: boolean;
  };
}

export interface ExtractionTargetsConfigurationPayload {
  // TODO: improve this type in the future
  files: any[];
  targets: EModelFeature[];
  protocols_rheobase: ['IDthresh'];
  auto_targets: null;
}

/* -------------------------------- >> Features -------------------------------- */

export type SpikeEventFeatureKeys = (typeof spikeEventFeatures)[number];
export type SpikeShapeFeatureKeys = (typeof spikeShapeFeatures)[number];
export type VoltageFeatureKeys = (typeof voltageFeatures)[number];
export type AllFeatureKeys = SpikeShapeFeatureKeys | SpikeEventFeatureKeys | VoltageFeatureKeys;
export interface FeatureItem<T extends AllFeatureKeys> {
  efeature: T;
  selected: boolean;
  uuid: string;
  displayName: string;
  description: string;
}
export type FeatureParameterGroup = {
  'Spike event': FeatureItem<SpikeEventFeatureKeys>[];
  'Spike shape': FeatureItem<SpikeShapeFeatureKeys>[];
  Voltage: FeatureItem<VoltageFeatureKeys>[];
};
export type FeatureCategory = keyof FeatureParameterGroup;
export type ECode = (typeof eCodes)[number];

export type FeaturePresetName = (typeof presetNames)[number];

/* ---------------------------------- Trace --------------------------------- */

export type TraceType = 'Trace';

export interface Trace extends Entity {
  '@type': ['Entity', TraceType, 'Dataset'];
  annotation: {
    '@type': ['QualityAnnotation', 'Annotation'];
    hasBody: {
      '@id': 'https://neuroshapes.org/Curated';
      '@type': ['AnnotationBody', 'DataMaturity'];
      label: 'Curated';
    };
    motivatedBy: {
      '@id': 'https://neuroshapes.org/qualityAssessment';
      '@type': 'Motivation';
    };
    name: string;
    note: string;
  };
  brainLocation: {
    '@type': 'BrainLocation';
    brainRegion: {
      '@id': string;
      label: string;
    };
    layer: {
      '@id': string;
      label: string;
    };
  };
  contribution: ContributionEntity;
  dateCreated: {
    '@type': 'xsd:dateTime';
    '@value': string;
  };
  distribution: Distribution;
  identifier: string;
  image: {
    '@id': string;
    about: 'nsg:StimulationTrace' | 'nsg:ResponseTrace';
    repetition: number;
    stimulusType: {
      '@id': string;
    };
  }[];
  name: string;
  note: string;
  stimulus: {
    '@type': 'Stimulus';
    stimulusType: {
      '@id': string;
      label: string;
    };
  }[];
  subject: {
    '@type': 'Subject';
    age: {
      period: string;
      unitCode: string;
      value: number;
    };
    species: {
      '@id': string;
      label: string;
    };
  };
}

export interface TraceResource extends ResourceMetadata, Trace {}

/* ---------------------------- NeuronMorphology ---------------------------- */

export type NeuronMorphologyType = 'NeuronMorphology';

export interface NeuronMorphology extends Entity {
  '@type': ['Entity', NeuronMorphologyType, 'ReconstructedCell'];
  contribution: ContributionEntity;
  distribution: Distribution;
  objectOfStudy: EModelObjectOfStudy;
  name: string;
}

export interface NeuronMorphologyResource extends ResourceMetadata, NeuronMorphology {}

/* ------------------------- SubCellularModelScript ------------------------- */

export type SubCellularModelScriptType = 'SubCellularModelScript';

export interface SubCellularModelScript extends Entity {
  '@type': ['Entity', SubCellularModelScriptType, 'Dataset'];
  contribution: ContributionEntity;
  distribution: Distribution;
  description: string;
  exposesParameter: {
    '@type': 'IonChannelMechanism' | 'ConductanceDensity';
    name: string;
    unitCode: string;
    lowerLimit?: number;
    readOnly?: boolean;
  }[];
  nmodlParameters: {
    suffix: string;
    write: string;
  };
  modelId: string;
  name: string;
  objectOfStudy: EModelObjectOfStudy;
  origin: string;
  suffix: string;
}

export interface SubCellularModelScriptResource extends ResourceMetadata, SubCellularModelScript {}

/* ------------------------------ EModelScript ------------------------------ */

export type EModelScriptType = 'EModelScript';

export interface EModelScript extends Entity {
  '@type': [EModelScriptType];
  name: string;
  distribution: Distribution;
  generation: Generation;
}

export interface EModelScriptResource extends ResourceMetadata, EModelScript {}

/* ----------------------------- EModelUIConfig ----------------------------- */

export interface EModelUIConfig {
  name: string;
  morphologies: ExemplarMorphologyDataType[];
  traces: ExperimentalTracesDataType[];
  mechanism: MechanismForUI[];
  parameters: SimulationParameter;
  featurePresetName: FeaturePresetName;
  mType: string;
  eType: string;
  brainRegionName: string;
  brainRegionId: string;
  species: 'mouse';
  ecodes_metadata: any;
}

/* -------------------------- EModelByETypeMapping -------------------------- */

export interface EModelByETypeMappingType {
  [eTypeName: string]: EModelMenuItem[];
}

/* ------------------------ EModelOptimizationConfig ------------------------ */

export type EModelOptimizationConfigType = 'EModelOptimizationConfig';

export interface EModelOptimizationConfig extends Entity {
  '@type': ['Entity', EModelOptimizationConfigType];
  distribution: Distribution;
  name: string;
  eType: string;
  mType: string;
  brainLocation: BrainLocation;
}

export interface EModelOptimizationConfigResource
  extends ResourceMetadata,
    EModelOptimizationConfig {}

/* ------------------------------- Parameters ------------------------------- */

export interface EModelRemoteParameters {
  parameters: EModelConfigurationParameter[];
  validationThreshold: number;
}
