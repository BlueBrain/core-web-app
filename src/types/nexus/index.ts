import { Entity, Distribution, ResourceMetadata, DateISOString } from './common';
import { SourceDataItem } from '@/components/papers/PaperCreationView/data';
import { MacroConnectomeEditEntry, SerialisibleMicroConnectomeEditEntry } from '@/types/connectome';
import { MModelWorkflowOverrides } from '@/types/m-model';

export * from './common';

export interface BrainModelConfig extends Entity {
  name: string;
  description: string;
  configs: {
    cellCompositionConfig: {
      '@id': string;
      '@type': [CellCompositionConfigType, 'Entity'];
    };
    cellPositionConfig: {
      '@id': string;
      '@type': [CellPositionConfigType, 'Entity'];
    };
    morphologyAssignmentConfig: {
      '@id': string;
      '@type': [MorphologyAssignmentConfigType, 'Entity'];
    };
    meModelConfig: {
      '@id': string;
      '@type': ['MEModelConfig', 'Entity'];
    };
    microConnectomeConfig: {
      '@id': string;
      '@type': [MicroConnectomeConfigType, 'Entity'];
    };
    synapseConfig: {
      '@id': string;
      '@type': [SynapseConfigType, 'Entity'];
    };
    macroConnectomeConfig: {
      '@id': string;
      '@type': [MacroConnectomeConfigType, 'Entity'];
    };
  };
}

export interface BrainModelConfigResource extends ResourceMetadata, BrainModelConfig {}

type CellCompositionGeneratorName = 'cell_composition';
type CellCompositionConfigType = 'CellCompositionConfig';

export interface CellCompositionConfig extends Entity {
  name: string;
  '@type': [CellCompositionConfigType, 'Entity'];
  generatorName: CellCompositionGeneratorName;
  description: string;
  distribution: Distribution;
  configVersion: number;
}

export interface CellCompositionConfigResource extends ResourceMetadata, CellCompositionConfig {}

type EtypeWorkflowConfigEntry = {
  label: string;
  about: string;
  density: number;
};

type MtypeWorkflowConfigEntry = {
  label: string;
  about: string;
  hasPart: Record<string, EtypeWorkflowConfigEntry>;
};

type BrainRegionWorkflowConfigEntry = {
  label: string;
  about: string;
  hasPart: Record<string, MtypeWorkflowConfigEntry>;
};

export type BrainRegionURI = string;

export type CompositionOverridesWorkflowConfig = Record<
  BrainRegionURI,
  BrainRegionWorkflowConfigEntry
>;

export type CellCompositionConfigPayload = {
  [rootBrainRegionURI: BrainRegionURI]: {
    variantDefinition: {
      algorithm: string;
      version: string;
    };
    inputs: {
      name: string;
      type: 'Dataset';
      id: string;
    }[];
    configuration: {
      version: number;
      unitCode: {
        density: string;
      };
      overrides: CompositionOverridesWorkflowConfig;
    };
    jobConfiguration: Record<string, string | number>;
  };
};

type CellPositionGeneratorName = 'cell_position';
type CellPositionConfigType = 'CellPositionConfig';

export interface CellPositionConfig extends Entity {
  name: string;
  description: string;
  '@type': [CellPositionConfigType, 'Entity'];
  generatorName: CellPositionGeneratorName;
  distribution: Distribution;
  configVersion: number;
}

export interface CellPositionConfigResource extends ResourceMetadata, CellPositionConfig {}

export type CellPositionConfigPayload = {
  [rootBrainRegionURI: BrainRegionURI]: {
    variantDefinition: {
      algorithm: string;
      version: string;
    };
    inputs: [];
    configuration: {
      place_cells: {
        soma_placement: string;
        density_factor: number;
        sort_by: string[];
        seed: number;
        mini_frequencies: boolean;
      };
    };
  };
};

export interface GeneratorTaskActivity extends Entity {
  generated: {
    '@id': string;
    '@type': string | string[];
  };
  startedAtTime: string;
  used_config: {
    '@id': string;
    '@type': string | string[];
  };
  used_rev: number;
  wasInfluencedBy: {
    '@id': string;
    '@type': string | string[];
  };
}

export interface GeneratorTaskActivityResource extends ResourceMetadata, GeneratorTaskActivity {}

export interface BrainLocation {
  '@type': 'BrainLocation';
  brainRegion: {
    '@id': string;
    label: string;
  };
}

export interface CellComposition extends Entity {
  about: string[];
  atlasRelease: {
    '@id': string;
    '@type': ['AtlasRelease', 'BrainAtlasRelease'];
  };
  atlasSpatialReferenceSystem: {
    '@id': string;
    '@type': 'AtlasSpatialReferenceSystem';
  };
  brainLocation: BrainLocation;
  cellCompositionSummary: {
    '@id': string;
    '@type': 'CellCompositionSummary';
  };
  cellCompositionVolume: {
    '@id': string;
    '@type': 'CellCompositionVolume';
  };
  contribution: ContributionEntity[];
  description: string;
  name: string;
}

export interface CellCompositionResource extends ResourceMetadata, CellComposition {}

export interface DetailedCircuit extends Entity {
  atlasRelease: {
    '@id': string;
    '@type': ['AtlasRelease', 'BrainAtlasRelease'];
  };
  brainLocation: BrainLocation & {
    brainRegion: {
      '@id': string;
      label: string;
      notation: string;
    };
  };
  circuitConfigPath: {
    '@type': 'DataDownload';
    url: string;
  };
  name: string;
  description: string;
  subject: {
    '@type': 'Subject';
    species: {
      '@id': string;
      label: string[];
    };
  };
}

export interface DetailedCircuitResource extends ResourceMetadata, DetailedCircuit {}

type MEModelGeneratorName = 'memodel';
type MEModelConfigType = 'MEModelConfig';

export interface MEModelConfig extends Entity {
  name: string;
  description: string;
  '@type': [MEModelConfigType, 'Entity'];
  generatorName: MEModelGeneratorName;
  distribution: Distribution;
  configVersion: number;
}

export interface MEModelConfigResource extends ResourceMetadata, MEModelConfig {}

export interface MEModelConfigPayload {
  variantDefinition: {
    neurons_me_model: {
      algorithm: 'neurons_me_model';
      version: 'v1';
    };
  };
  defaults: {
    neurons_me_model: {
      '@id': string;
      '@type': ['PlaceholderEModelConfig', 'Entity'];
    };
  };
  overrides: {
    neurons_me_model: {
      [regionId: string]: {
        [mTypeId: string]: {
          [eTypeId: string]: {
            assignmentAlgorithm: 'assignOne';
            eModel: {
              '@id': string;
              _rev: number;
            };
            axonInitialSegmentAssignment: { fixedValue: { value: number } };
          };
        };
      };
    };
  };
}

type MorphologyAssignmentConfigType = 'MorphologyAssignmentConfig';
type MModelGeneratorName = 'mmodel';

export interface MorphologyAssignmentConfig extends Entity {
  name: string;
  description: string;
  '@type': [MorphologyAssignmentConfigType, 'Entity'];
  '@context': 'https://bbp.neuroshapes.org';
  generatorName: MModelGeneratorName;
  distribution: Distribution;
  configVersion: number;
}

export interface MorphologyAssignmentConfigResource
  extends ResourceMetadata,
    MorphologyAssignmentConfig {}

export type MorphologyAssignmentConfigPayload = {
  variantDefinition: {
    topological_synthesis: {
      algorithm: string;
      version: string;
    };
    placeholder_assignment: {
      algorithm: string;
      version: string;
    };
  };
  defaults: {
    topological_synthesis: {
      '@id': string;
      '@type': ['CanonicalMorphologyModelConfig', 'Entity'];
    };
    placeholder_assignment: {
      '@id': string;
      '@type': ['PlaceholderMorphologyConfig', 'Entity'];
    };
  };
  configuration: {
    topological_synthesis: MModelWorkflowOverrides;
  };
};

type MicroConnectomeGeneratorName = 'connectome';
type MicroConnectomeConfigType = 'MicroConnectomeConfig';

export interface MicroConnectomeConfig extends Entity {
  name: string;
  description: string;
  '@type': [MicroConnectomeConfigType, 'Entity'];
  generatorName: MicroConnectomeGeneratorName;
  distribution: Distribution;
  configVersion: number;
}

export interface MicroConnectomeConfigResource extends ResourceMetadata, MicroConnectomeConfig {}

export type IdRev = {
  id: string;
  rev: number;
};

export interface MicroConnectomeConfigPayload {
  variants: {
    [variantName: string]: {
      algorithm: string;
      version: string;
      params: {
        [paramKey: string]: {
          type: 'float32';
          unitCode: string;
          default: number;
        };
      };
    };
  };
  initial: {
    variants: IdRev & { type: ['Entity', 'Dataset', 'MicroConnectomeVariantSelection'] };
  } & {
    [variantName: string]: IdRev & { type: ['Entity', 'Dataset', 'MicroConnectomeData'] };
  };
  overrides: {
    variants: IdRev & { type: ['Entity', 'Dataset', 'MicroConnectomeVariantSelectionOverrides'] };
  } & {
    [variantName: string]: IdRev & { type: ['Entity', 'Dataset', 'MicroConnectomeDataOverrides'] };
  };
  _ui_data?: {
    editHistory?: SerialisibleMicroConnectomeEditEntry[];
  };
}

export interface MicroConnectomeEntryBase {
  atlasRelease: {
    '@id': string;
    '@type': ['BrainAtlasRelease', 'AtlasRelease'];
  };
  brainLocation: BrainLocation;
  name: string;
  distribution: Distribution;
}

export interface MicroConnectomeVariantSelection extends MicroConnectomeEntryBase, Entity {
  '@type': ['Entity', 'Dataset', 'MicroConnectomeVariantSelection'];
}

export interface MicroConnectomeVariantSelectionResource
  extends ResourceMetadata,
    MicroConnectomeVariantSelection {}

export interface MicroConnectomeVariantSelectionOverrides extends MicroConnectomeEntryBase, Entity {
  '@type': ['Entity', 'Dataset', 'MicroConnectomeVariantSelectionOverrides'];
}

export interface MicroConnectomeVariantSelectionOverridesResource
  extends ResourceMetadata,
    MicroConnectomeVariantSelectionOverrides {}

export interface MicroConnectomeData extends MicroConnectomeEntryBase, Entity {
  '@type': ['Entity', 'Dataset', 'MicroConnectomeData'];
}

export interface MicroConnectomeDataResource extends ResourceMetadata, MicroConnectomeData {}

export interface MicroConnectomeDataOverrides extends MicroConnectomeEntryBase, Entity {
  '@type': ['Entity', 'Dataset', 'MicroConnectomeDataOverrides'];
}

export interface MicroConnectomeDataOverridesResource
  extends ResourceMetadata,
    MicroConnectomeDataOverrides {}

type SynapseGeneratorName = 'connectome_filtering';
export type SynapseConfigType = 'SynapseConfig';

export interface SynapseConfig extends Entity {
  name: string;
  description: string;
  '@type': [SynapseConfigType, 'Entity'];
  generatorName: SynapseGeneratorName;
  distribution: Distribution;
  configVersion: number;
}

export interface SynapseConfigResource extends ResourceMetadata, SynapseConfig {}
export interface RulesResource extends ResourceMetadata, Entity {
  distribution: Distribution;
}

export type TypesResource = RulesResource;
export interface SynapseConfigPayload {
  variantDefinition: {
    algorithm: string;
    version: string;
  };
  defaults: {
    synapse_properties: {
      id: string;
      type: ['Dataset', 'SynapticParameterAssignment'];
      rev: number;
    };
    synapses_classification: {
      id: string;
      type: ['Dataset', 'SynapticParameter'];
      rev: number;
    };
  };
  configuration: {
    synapse_properties: {
      id: string;
      type: ['Dataset', 'SynapticParameterAssignment'];
      rev: number;
    };
    synapses_classification: {
      id: string;
      type: ['Dataset', 'SynapticParameter'];
      rev: number;
    };
  };
}

type MacroConnectomeGeneratorName = 'connectome';
type MacroConnectomeConfigType = 'MacroConnectomeConfig';

export interface MacroConnectomeConfig extends Entity {
  name: string;
  description: string;
  type: [MacroConnectomeConfigType, 'Entity'];
  generatorName: MacroConnectomeGeneratorName;
  distribution: Distribution;
  configVersion: number;
}

export interface MacroConnectomeConfigResource extends ResourceMetadata, MacroConnectomeConfig {}

export interface MacroConnectomeConfigPayload {
  initial: {
    connection_strength: {
      id: string;
      type: ['Entity', 'Dataset', 'WholeBrainConnectomeStrength'];
      rev: number;
    };
  };
  overrides: {
    connection_strength: {
      id: string;
      type: ['Entity', 'Dataset', 'WholeBrainConnectomeStrength'];
      rev: number;
    };
  };
  _ui_data?: {
    editHistory?: MacroConnectomeEditEntry[];
  };
}

export interface BbpWorkflowConfigResource extends Entity {
  '@type': 'BbpWorkflowConfig';
  distribution: Distribution;
}

export interface VariantTaskActivity extends Entity {
  '@type': 'VariantTaskActivity';
  generated: {
    '@type': 'DetailedCircuit';
    '@id': string;
  };
  startedAtTime: string;
  used_config: {
    '@type': [VariantTaskConfigType, 'Entity'];
    '@id': string;
  };
  used_rev: number;
  wasInfluencedBy: {
    '@type': 'WorkflowExecution';
    '@id': string;
  };
}

export interface VariantTaskActivityResource extends ResourceMetadata, VariantTaskActivity {}

export type VariantTaskConfigType = 'VariantTaskConfig';
export interface VariantTaskConfig extends Entity {
  '@type': [VariantTaskConfigType, 'Entity'];
  name: string;
  distribution: Distribution;
}

export interface VariantTaskConfigResource extends ResourceMetadata, VariantTaskConfig {}

export interface WholeBrainConnectomeStrength extends Entity {
  '@type': ['WholeBrainConnectomeStrength', 'Dataset', 'Entity'];
  name: string;
  distribution: Distribution;
}

export interface WholeBrainConnectomeStrengthResource
  extends ResourceMetadata,
    WholeBrainConnectomeStrength {}

export type GeneratorConfig =
  | CellCompositionConfig
  | CellPositionConfig
  | MorphologyAssignmentConfig
  | MEModelConfig
  | MicroConnectomeConfig
  | SynapseConfig
  | MacroConnectomeConfig;

export type GeneratorConfigPayload =
  | CellCompositionConfigPayload
  | CellPositionConfigPayload
  | MorphologyAssignmentConfigPayload
  | MEModelConfigPayload
  | MicroConnectomeConfigPayload
  | SynapseConfigPayload
  | MacroConnectomeConfigPayload;

export type SubConfigName =
  | 'cellCompositionConfig'
  | 'cellPositionConfig'
  | 'morphologyAssignmentConfig'
  | 'meModelConfig'
  | 'microConnectomeConfig'
  | 'synapseConfig'
  | 'macroConnectomeConfig';

export interface SimulationCampaignUIConfig extends Entity {
  '@type': ['Entity', 'SimulationCampaignUIConfig'];
  name: string;
  description: string;
  used: {
    '@type': 'DetailedCircuit';
    '@id': string;
  };
  distribution: Distribution;
  wasInfluencedBy?: {
    '@type': 'WorkflowExecution';
    '@id': string;
  };
  contribution: ContributionEntity | ContributionEntity[];
}

export type EntityCreation<T> = Omit<T, '@id'>;

export interface SimulationCampaignUIConfigResource
  extends ResourceMetadata,
    SimulationCampaignUIConfig {}

export type WorkflowExecutionStatusType = 'Done' | 'Running' | 'Failed';

export interface WorkflowExecution extends Entity {
  '@type': ['Entity', 'WorkflowExecution'];
  configFileName: string;
  distribution: Distribution;
  endedAtTime: DateISOString;
  module: string;
  name: string;
  parameters: string;
  startedAtTime: DateISOString;
  status: WorkflowExecutionStatusType;
  task: string;
  version: string;
}

export interface ContributionEntity {
  '@type': 'Contribution';
  agent: AgentOrIsPartOfOrLicense;
  hadRole?: {
    '@id': string;
    label: string;
    prefLabel: string;
  };
}

export interface AgentOrIsPartOfOrLicense {
  '@id': string;
  '@type': string;
  email?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  preferred_username?: string;
}

export type SupportedConfigListTypes =
  | BrainModelConfigResource
  | SimulationCampaignUIConfigResource
  | LaunchedSimCampUIConfigType;

export type LaunchedSimCampUIConfigType = SimulationCampaignUIConfigResource & {
  endedAtTime: DateISOString;
  startedAtTime: DateISOString;
  status: WorkflowExecutionStatusType;
};

type NeuronMorphologyModelDistributionType = 'NeuronMorphologyModelDistribution';

export interface NeuronMorphologyModelDistribution extends Entity {
  name: string;
  description: string;
  '@type': [NeuronMorphologyModelDistributionType, 'Entity'];
  distribution: Distribution;
}

export interface NeuronMorphologyModelDistributionResource
  extends ResourceMetadata,
    NeuronMorphologyModelDistribution {}

type NeuronMorphologyModelParameterType = 'NeuronMorphologyModelParameter';

export interface NeuronMorphologyModelParameter extends Entity {
  name: string;
  description: string;
  '@type': [NeuronMorphologyModelParameterType, 'Entity'];
  distribution: Distribution;
}

export interface NeuronMorphologyModelParameterResource
  extends ResourceMetadata,
    NeuronMorphologyModelParameter {}

type CanonicalMorphologyModelType = 'CanonicalMorphologyModel';

export interface CanonicalMorphologyModel extends Entity {
  name: string;
  description: string;
  about: 'NeuronMorphology';
  '@type': [CanonicalMorphologyModelType, 'Entity'];
  morphologyModelDistribution: {
    '@id': string;
    '@type': [NeuronMorphologyModelDistributionType, 'Entity'];
    rev: number;
  };
  morphologyModelParameter: {
    '@id': string;
    '@type': [NeuronMorphologyModelParameterType, 'Entity'];
    rev: number;
  };
}

export interface CanonicalMorphologyModelResource
  extends ResourceMetadata,
    CanonicalMorphologyModel {}

type CanonicalMorphologyModelConfigType = 'CanonicalMorphologyModelConfig';

export interface CanonicalMorphologyModelConfig extends Entity {
  name: string;
  description: string;
  '@type': [CanonicalMorphologyModelConfigType, 'Entity'];
  distribution: Distribution;
}

export interface CanonicalMorphologyModelConfigResource
  extends ResourceMetadata,
    CanonicalMorphologyModelConfig {}

export type CanonicalMorphologyModelConfigPayload = {
  hasPart: {
    [brainRegionId: string]: {
      about: 'BrainRegion';
      _rev: number;
      hasPart: {
        [mTypeId: string]: {
          _rev: number;
          about: 'NeuronMorphologicalType';
          hasPart: {
            [canonicalMorphologyModelId: string]: {
              about: CanonicalMorphologyModelType;
              _rev: number;
            };
          };
        };
      };
    };
  };
};

export interface SingleNeuronSimulation extends Entity {
  '@type': ['Entity', 'SingleNeuronSimulation'];
  name: string;
  description: string;
  used: {
    '@type': 'EModel' | 'MEModel';
    '@id': string;
  };
  distribution: Distribution | Array<Distribution>;
  injectionLocation: string;
  recordingLocation: string[];
  brainLocation?: BrainLocation;
}

export interface SynaptomeSimulation extends Entity {
  '@type': ['Entity', 'SynaptomeSimulation'];
  name: string;
  description: string;
  used: {
    '@type': 'EModel' | 'MEModel';
    '@id': string;
  };
  distribution: Distribution | Array<Distribution>;
  injectionLocation: string;
  recordingLocation: string[];
  brainLocation?: BrainLocation;
}

export interface SingleNeuronSimulationResource extends ResourceMetadata, SingleNeuronSimulation {}

export interface Paper extends Entity {
  '@type': ['ScholarlyArticle', 'Entity'];
  name: string;
  description: string;
  tags: string[];
  virtualLabId: string;
  projectId: string;
  distribution: Distribution;
  sourceData: Array<SourceDataItem>;
  generateOutline: boolean;
}

export interface PaperResource extends ResourceMetadata, Paper {}
