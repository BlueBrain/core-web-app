import { MModelMenuItem } from './m-model';
import { ContributionEntity, Distribution, Entity, ResourceMetadata } from './nexus';
import {
  eCodes,
  spikeEventFeatures,
  spikeShapeFeatures,
  voltageFeatures,
} from '@/constants/cell-model-assignment/e-model';
import { NexusEntityType } from '@/types/nexus/common';

export interface EModelMenuItem {
  label: string;
  id: string;
  mType: MModelMenuItem;
  annotation?: string;
  uuid: string;
}

export type SimulationParameterKeys = 'Temperature (°C)' | 'Ra' | 'Initial voltage';
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

/* --------------------------------- EModel --------------------------------- */

export type EModelType = 'EModel';

export interface EModel extends EModelCommonProps {
  '@type': NexusEntityType<EModelType>;
  description: string;
  distribution: Distribution[];
  generation: {
    '@type': 'Generation';
    activity: {
      '@type': 'Activity';
      followedWorkflow: {
        '@id': string;
        '@type': 'EModelWorkflow';
      };
    };
  };
  seed: number;
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
  '@type': NexusEntityType<EModelWorkflowType>;
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
  '@type': NexusEntityType<EModelConfigurationType>;
  uses: {
    '@id': string;
    '@type': NeuronMorphologyType | SubCellularModelScriptType;
  }[];
  distribution: Distribution;
}

export interface EModelConfigurationResource extends ResourceMetadata, EModelConfiguration {}

export interface EModelConfigurationMechanism {
  name: string;
  stochastic: boolean;
  location: string;
  version: null;
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

/* ------------------------- EModelPipelineSettings ------------------------- */

export type EModelPipelineSettingsType = 'EModelPipelineSettings';

export interface EModelPipelineSettings extends EModelCommonProps {
  '@type': NexusEntityType<EModelPipelineSettingsType>;
  distribution: Distribution;
}

export interface EModelPipelineSettingsResource extends ResourceMetadata, EModelPipelineSettings {}

/* --------------------- ExtractionTargetsConfiguration --------------------- */

export type ExtractionTargetsConfigurationType = 'ExtractionTargetsConfiguration';

export interface ExtractionTargetsConfiguration extends EModelCommonProps {
  '@type': NexusEntityType<ExtractionTargetsConfigurationType>;
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
export interface FeatureItem<T extends AllFeatureKeys> extends EModelFeature {
  efeature: T;
  selected: boolean;
  uuid: string;
  displayName: string;
}
export type FeatureParameterGroup = {
  'Spike event': FeatureItem<SpikeEventFeatureKeys>[];
  'Spike shape': FeatureItem<SpikeShapeFeatureKeys>[];
  Voltage: FeatureItem<VoltageFeatureKeys>[];
};
export type FeatureCategory = keyof FeatureParameterGroup;
export type ECode = (typeof eCodes)[number];

/* ---------------------------------- Trace --------------------------------- */

export type TraceType = 'Trace';

export interface Trace extends Entity {
  '@type': NexusEntityType<TraceType>;
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
  '@type': NexusEntityType<NeuronMorphologyType>;
  contribution: ContributionEntity;
  distribution: Distribution;
  objectOfStudy: EModelObjectOfStudy;
  name: string;
}

export interface NeuronMorphologyResource extends ResourceMetadata, NeuronMorphology {}

/* ------------------------- SubCellularModelScript ------------------------- */

export type SubCellularModelScriptType = 'SubCellularModelScript';

export interface SubCellularModelScript extends Entity {
  '@type': NexusEntityType<SubCellularModelScriptType>;
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

export interface MechanismForUI {
  '@id'?: string;
  name: string;
  description: string;
}

/* ----------------------------- EModelUIConfig ----------------------------- */

export interface EModelUIConfig {
  morphology: ExemplarMorphologyDataType | null;
  traces: ExperimentalTracesDataType[];
  mechanism: MechanismForUI[];
  parameters: Record<SimulationParameterKeys, number>;
  features: FeatureParameterGroup;
}
