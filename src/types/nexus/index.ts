import { Entity, Distribution, ResourceMetadata } from './common';

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
    eModelAssignmentConfig: {
      '@id': string;
      '@type': [EModelAssignmentConfigType, 'Entity'];
    };
    morphologyAssignmentConfig: {
      '@id': string;
      '@type': [MorphologyAssignmentConfigType, 'Entity'];
    };
    microConnectomeConfig: {
      '@id': string;
      '@type': [MicroConnectomeConfigType, 'Entity'];
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
  '@type': [CellPositionConfigType, 'Entity'];
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
  contribution: [
    {
      '@type': 'Contribution';
      agent: {
        '@id': string;
        '@type': ['Agent', 'Person'];
        name: string;
      };
    }
  ];
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
  '@type': [EModelAssignmentConfigType, 'Entity'];
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

export interface MorphologyAssignmentConfig extends Entity {
  name: string;
  description: string;
  '@type': [MorphologyAssignmentConfigType, 'Entity'];
  generatorName: PlaceholderGeneratorName;
  distribution: Distribution;
}

export interface MorphologyAssignmentConfigResource
  extends ResourceMetadata,
    MorphologyAssignmentConfig {}

export type MorphologyAssignmentConfigPayload = {
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

type MicroConnectomeGeneratorName = 'connectome';
type MicroConnectomeConfigType = 'MicroConnectomeConfig';

export interface MicroConnectomeConfig extends Entity {
  name: string;
  description: string;
  '@type': [MicroConnectomeConfigType, 'Entity'];
  generatorName: MicroConnectomeGeneratorName;
  distribution: Distribution;
}

export interface MicroConnectomeConfigResource extends ResourceMetadata, MicroConnectomeConfig {}

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
    '@type': ['VariantTaskConfig', 'Entity'];
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
  '@type': ['VariantTaskConfig', 'Entity'];
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
  | EModelAssignmentConfig
  | MorphologyAssignmentConfig
  | MicroConnectomeConfig;

export type GeneratorName =
  | CellCompositionGeneratorName
  | CellPositionGeneratorName
  | PlaceholderGeneratorName
  | MicroConnectomeGeneratorName;

export type GeneratorConfigType =
  | CellCompositionConfigType
  | CellPositionConfigType
  | EModelAssignmentConfigType
  | MorphologyAssignmentConfigType
  | MicroConnectomeConfigType;
