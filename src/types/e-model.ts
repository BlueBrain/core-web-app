import { MModelMenuItem } from './m-model';
import { ContributionEntity, Distribution, Entity, ResourceMetadata } from './nexus';

export interface EModelMenuItem {
  label: string;
  id: string;
  mType: MModelMenuItem;
  annotation?: string;
  uuid: string;
}

export type SimulationParameterKeys = 'Temperature' | 'Ra' | 'Calcium' | 'XXXX';
export type SimulationParameter = Record<SimulationParameterKeys, number>;

export type FeaturesCategories = 'Spike shape' | 'Spike event' | 'Voltage';
export type FeaturesKeys =
  | 'decay_time_constant_after_sim'
  | 'maximum_voltage'
  | 'maximum_voltage_from_voltagebase'
  | 'min_AHP-indices'
  | 'min_AHP-values'
  | 'min_voltage_between_spikes'
  | 'minimum_voltage'
  | 'peak_indices'
  | 'steady_state_hyper'
  | 'steady_state_voltage'
  | 'steady_state_voltage_stimend'
  | 'trace_check'
  | 'voltage'
  | 'voltage_after_stim'
  | 'voltage_base'
  | 'voltage_deflection'
  | 'voltage_deflection_begin'
  | 'voltage_deflection_vb_ssse';
export type FeatureParameterItem = {
  parameterName: FeaturesKeys;
  selected: boolean;
};
export type FeatureParameterGroup = Record<FeaturesCategories, FeatureParameterItem[]>;

export interface ExamplarMorphologyDataType {
  name: string;
  description: string;
  brainLocation: string;
  mType: string;
  contributor: string;
}

export interface ExperimentalTracesDataType {
  cellName: string;
  mType: string;
  eType: string;
  description: string;
  eCode: string;
  subjectSpecies: string;
}

/* --------------------------------- EModel --------------------------------- */

export type EModelType = 'EModel';

export interface EModel extends EModelCommonProps {
  '@type': ['Entity', EModelType];
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
  objectOfStudy: {
    '@id': 'http://bbp.epfl.ch/neurosciencegraph/taxonomies/objectsofstudy/singlecells';
    '@type': 'nsg:ObjectOfStudy';
    label: 'Single Cell';
  };
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
  state: string;
}

export interface EModelWorkflowResource extends ResourceMetadata, EModelWorkflow {}

/* --------------------------- EModelConfiguration -------------------------- */

export type EModelConfigurationType = 'EModelConfiguration';

export interface EModelConfiguration extends EModelCommonProps {
  '@type': ['Entity', EModelConfigurationType];
  uses: {
    '@id': string;
    '@type': 'NeuronMorphology' | 'SubCellularModelScript';
  }[];
}

export interface EModelConfigurationResource extends ResourceMetadata, EModelConfiguration {}

/* ------------------------- EModelPipelineSettings ------------------------- */

export type EModelPipelineSettingsType = 'EModelPipelineSettings';

export interface EModelPipelineSettings extends EModelCommonProps {
  '@type': ['Entity', EModelPipelineSettingsType];
}

export interface EModelPipelineSettingsResource extends ResourceMetadata, EModelPipelineSettings {}

/* --------------------- ExtractionTargetsConfiguration --------------------- */

export type ExtractionTargetsConfigurationType = 'ExtractionTargetsConfiguration';

export interface ExtractionTargetsConfiguration extends EModelCommonProps {
  '@type': ['Entity', ExtractionTargetsConfigurationType];
  distribution: Distribution[];
  uses: {
    '@id': string;
    '@type': TraceType;
  }[];
}

export interface ExtractionTargetsConfigurationResource
  extends ResourceMetadata,
    ExtractionTargetsConfiguration {}

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
