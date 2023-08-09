import { Entity, Distribution, ResourceMetadata, DateISOString, NexusEntityType } from './common';
import { MacroConnectomeEditEntry } from '@/types/connectome';
import { MModelWorkflowOverrides } from '@/types/m-model';

export * from './common';

export type IdType =
  | 'file'
  | 'modelconfiguration'
  | 'cellcompositionconfig'
  | 'cellpositionconfig'
  | 'emodelassignmentconfig'
  | 'morphologyassignmentconfig'
  | 'microconnectomeconfig'
  | 'synapseconfig'
  | 'macroconnectomeconfig'
  | 'wholebrainconnectomestrength'
  | 'simulationcampaignuiconfig'
  | 'bbpworkflowconfig';

export interface BrainModelConfig extends Entity {
  name: string;
  description: string;
  configs: {
    cellCompositionConfig: {
      '@id': string;
      '@type': NexusEntityType<CellCompositionConfigType>;
    };
    cellPositionConfig: {
      '@id': string;
      '@type': NexusEntityType<CellPositionConfigType>;
    };
    eModelAssignmentConfig: {
      '@id': string;
      '@type': NexusEntityType<EModelAssignmentConfigType>;
    };
    morphologyAssignmentConfig: {
      '@id': string;
      '@type': NexusEntityType<MorphologyAssignmentConfigType>;
    };
    microConnectomeConfig: {
      '@id': string;
      '@type': NexusEntityType<MicroConnectomeConfigType>;
    };
    synapseConfig: {
      '@id': string;
      '@type': NexusEntityType<SynapseConfigType>;
    };
    macroConnectomeConfig: {
      '@id': string;
      '@type': NexusEntityType<MacroConnectomeConfigType>;
    };
  };
}

export interface BrainModelConfigResource extends ResourceMetadata, BrainModelConfig {}

type CellCompositionGeneratorName = 'cell_composition';
type CellCompositionConfigType = 'CellCompositionConfig';

export interface CellCompositionConfig extends Entity {
  name: string;
  '@type': NexusEntityType<CellCompositionConfigType>;
  generatorName: CellCompositionGeneratorName;
  description: string;
  distribution: Distribution;
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
  '@type': NexusEntityType<CellPositionConfigType>;
  generatorName: CellPositionGeneratorName;
  distribution: Distribution;
}

export interface CellPositionConfigResource extends ResourceMetadata, CellPositionConfig {}

export interface GeneratorTaskActivity extends Entity {
  generated: {
    '@id': string;
    '@type': string | string[];
  };
  startedAtTime: string;
  used: {
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
  brainLocation: {
    '@type': 'BrainLocation';
    brainRegion: {
      '@id': string;
      label: string;
    };
  };
  cellCompositionSummary: {
    '@id': string;
    '@type': 'CellCompositionSummary';
  }[];
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
  brainLocation: {
    '@type': 'BrainLocation';
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

type PlaceholderGeneratorName = 'placeholder';
type EModelAssignmentConfigType = 'EModelAssignmentConfig';

export interface EModelAssignmentConfig extends Entity {
  name: string;
  description: string;
  '@type': NexusEntityType<EModelAssignmentConfigType>;
  generatorName: PlaceholderGeneratorName;
  distribution: Distribution;
}

export interface EModelAssignmentConfigResource extends ResourceMetadata, EModelAssignmentConfig {}

export type EModelAssignmentConfigPayload = {
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
    configuration: {};
    jobConfiguration: Record<string, string | number>;
  };
};

type MorphologyAssignmentConfigType = 'MorphologyAssignmentConfig';
type MModelGeneratorName = 'mmodel';

export interface MorphologyAssignmentConfig extends Entity {
  name: string;
  description: string;
  '@type': NexusEntityType<MorphologyAssignmentConfigType>;
  '@context': 'https://bbp.neuroshapes.org';
  generatorName: MModelGeneratorName;
  distribution: Distribution;
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
      id: string;
      type: NexusEntityType<'CanonicalMorphologyModelConfig'>;
      rev: number;
    };
    placeholder_assignment: {
      id: string;
      type: NexusEntityType<'PlaceholderMorphologyConfig'>;
      rev: number;
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
  '@type': NexusEntityType<MicroConnectomeConfigType>;
  generatorName: MicroConnectomeGeneratorName;
  distribution: Distribution;
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
    variants: IdRev & { type: NexusEntityType<'MicroConnectomeVariantSelection'> };
  } & {
    [variantName: string]: IdRev & { type: NexusEntityType<'MicroConnectomeData'> };
  };
  overrides: {
    variants: IdRev & { type: NexusEntityType<'MicroConnectomeVariantSelectionOverrides'> };
  } & {
    [variantName: string]: IdRev & { type: NexusEntityType<'MicroConnectomeDataOverrides'> };
  };
}

export interface MicroConnectomeEntryBase {
  atlasRelease: {
    '@id': string;
    '@type': ['BrainAtlasRelease', 'AtlasRelease'];
  };
  brainLocation: {
    '@type': 'BrainLocation';
    brainRegion: {
      '@id': string;
      label: string;
    };
  };
  name: string;
  distribution: Distribution;
}

export interface MicroConnectomeVariantSelection extends MicroConnectomeEntryBase, Entity {
  '@type': NexusEntityType<'MicroConnectomeVariantSelection'>;
}

export interface MicroConnectomeVariantSelectionResource
  extends ResourceMetadata,
    MicroConnectomeVariantSelection {}

export interface MicroConnectomeVariantSelectionOverrides extends MicroConnectomeEntryBase, Entity {
  '@type': NexusEntityType<'MicroConnectomeVariantSelectionOverrides'>;
}

export interface MicroConnectomeVariantSelectionOverridesResource
  extends ResourceMetadata,
    MicroConnectomeVariantSelectionOverrides {}

export interface MicroConnectomeData extends MicroConnectomeEntryBase, Entity {
  '@type': NexusEntityType<'MicroConnectomeData'>;
}

export interface MicroConnectomeDataResource extends ResourceMetadata, MicroConnectomeData {}

export interface MicroConnectomeDataOverrides extends MicroConnectomeEntryBase, Entity {
  '@type': NexusEntityType<'MicroConnectomeDataOverrides'>;
}

export interface MicroConnectomeDataOverridesResource
  extends ResourceMetadata,
    MicroConnectomeDataOverrides {}

type SynapseGeneratorName = 'connectome_filtering';
type SynapseConfigType = 'SynapseConfig';

export interface SynapseConfig extends Entity {
  name: string;
  description: string;
  '@type': NexusEntityType<SynapseConfigType>;
  generatorName: SynapseGeneratorName;
  distribution: Distribution;
}

export interface SynapseConfigResource extends ResourceMetadata, SynapseConfig {}
export interface RulesResource extends ResourceMetadata, Entity {
  distribution: Distribution;
}

export type TypesResource = RulesResource;
export interface SynapseConfigPayload {
  configuration: {
    synapse_properties: {
      id: string;
      type: NexusEntityType<'SynapticParameterAssignment'>;
      rev: number;
    };
    synapses_classification: {
      id: string;
      type: NexusEntityType<'SynapticParameter'>;
      rev: number;
    };
  };
}

type MacroConnectomeGeneratorName = 'connectome';
type MacroConnectomeConfigType = 'MacroConnectomeConfig';

export interface MacroConnectomeConfig extends Entity {
  name: string;
  description: string;
  type: NexusEntityType<MacroConnectomeConfigType>;
  generatorName: MacroConnectomeGeneratorName;
  distribution: Distribution;
}

export interface MacroConnectomeConfigResource extends ResourceMetadata, MacroConnectomeConfig {}

export interface MacroConnectomeConfigPayload {
  bases: {
    connection_strength: {
      id: string;
      type: NexusEntityType<'WholeBrainConnectomeStrength'>;
      rev: number;
    };
  };
  overrides: {
    connection_strength: {
      id: string;
      type: NexusEntityType<'WholeBrainConnectomeStrength'>;
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
  used: {
    '@type': NexusEntityType<'VariantTaskConfig'>;
    '@id': string;
  };
  used_rev: number;
  wasInfluencedBy: {
    '@type': 'WorkflowExecution';
    '@id': string;
  };
}

export interface VariantTaskActivityResource extends ResourceMetadata, VariantTaskActivity {}

export interface VariantTaskConfig extends Entity {
  '@type': NexusEntityType<'VariantTaskConfig'>;
  name: string;
  distribution: Distribution;
}

export interface VariantTaskConfigResource extends ResourceMetadata, VariantTaskConfig {}

export interface WholeBrainConnectomeStrength extends Entity {
  '@type': NexusEntityType<'WholeBrainConnectomeStrength'>;
  name: string;
  distribution: Distribution;
}

export interface WholeBrainConnectomeStrengthResource
  extends ResourceMetadata,
    WholeBrainConnectomeStrength {}

export type GeneratorConfig =
  | CellCompositionConfig
  | CellPositionConfig
  | EModelAssignmentConfig
  | MorphologyAssignmentConfig
  | MicroConnectomeConfig
  | SynapseConfig
  | MacroConnectomeConfig;

export type GeneratorName =
  | CellCompositionGeneratorName
  | CellPositionGeneratorName
  | PlaceholderGeneratorName
  | MicroConnectomeGeneratorName
  | SynapseGeneratorName
  | MacroConnectomeGeneratorName
  | MModelGeneratorName;

export type GeneratorConfigType =
  | CellCompositionConfigType
  | CellPositionConfigType
  | EModelAssignmentConfigType
  | MorphologyAssignmentConfigType
  | MicroConnectomeConfigType
  | SynapseConfigType
  | MacroConnectomeConfigType;

export interface SimulationCampaignUIConfig extends Entity {
  '@type': NexusEntityType<'SimulationCampaignUIConfig'>;
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

export interface SimulationCampaignUIConfigResource
  extends ResourceMetadata,
    SimulationCampaignUIConfig {}

export type WorkflowExecutionStatusType = 'Done' | 'Running' | 'Failed';

export interface WorkflowExecution extends Entity {
  '@type': NexusEntityType<'WorkflowExecution'>;
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
  '@type': NexusEntityType<NeuronMorphologyModelDistributionType>;
  distribution: Distribution;
}

export interface NeuronMorphologyModelDistributionResource
  extends ResourceMetadata,
    NeuronMorphologyModelDistribution {}

type NeuronMorphologyModelParameterType = 'NeuronMorphologyModelParameter';

export interface NeuronMorphologyModelParameter extends Entity {
  name: string;
  description: string;
  '@type': NexusEntityType<NeuronMorphologyModelParameterType>;
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
  '@type': NexusEntityType<CanonicalMorphologyModelType>;
  morphologyModelDistribution: {
    '@id': string;
    '@type': NexusEntityType<NeuronMorphologyModelDistributionType>;
    rev: number;
  };
  morphologyModelParameter: {
    '@id': string;
    '@type': NexusEntityType<NeuronMorphologyModelParameterType>;
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
  '@type': NexusEntityType<CanonicalMorphologyModelConfigType>;
  distribution: Distribution;
}

export interface CanonicalMorphologyModelConfigResource
  extends ResourceMetadata,
    CanonicalMorphologyModelConfig {}

export type CanonicalMorphologyModelConfigPayload = {
  hasPart: {
    [brainRegionId: string]: {
      about: 'BrainRegion';
      rev: number;
      hasPart: {
        [mTypeId: string]: {
          rev: number;
          about: 'NeuronMorphologicalType';
          hasPart: {
            [canonicalMorphologyModelId: string]: {
              about: CanonicalMorphologyModelType;
              rev: number;
            };
          };
        };
      };
    };
  };
};
