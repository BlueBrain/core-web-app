import { Entity, Distribution, ResourceMetadata } from './common';

export * from './common';

export interface BrainModelConfig extends Entity {
  name: string;
  description: string;
  configs: {
    cellCompositionConfig?: {
      '@id': string;
      '@type': ['CellCompositionConfig', 'Entity'];
    };
    cellPositionConfig?: {
      '@id': string;
      '@type': ['CellPositionConfig', 'Entity'];
    };
    eModelAssignmentConfig?: {
      '@id': string;
      '@type': ['EModelAssignmentConfig', 'Entity'];
    };
    morphologyAssignmentConfig?: {
      '@id': string;
      '@type': ['MorphologyAssignmentConfig', 'Entity'];
    };
  };
}

export interface BrainModelConfigResource extends ResourceMetadata, BrainModelConfig {}

export interface CellCompositionConfig extends Entity {
  name: string;
  '@type': ['CellCompositionConfig', 'Entity'];
  generatorName: 'cell_composition';
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
      base_atlas_density_dataset: {
        '@id': string;
        _rev: number;
      };
      overrides: CompositionOverridesWorkflowConfig;
    };
    jobConfiguration: Record<string, string | number>;
  };
};

export interface CellPositionConfig extends Entity {
  name: string;
  description: string;
  '@type': ['CellPositionConfig', 'Entity'];
  generatorName: 'me_type_property';
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

export interface EModelAssignmentConfig extends Entity {
  name: string;
  description: string;
  '@type': ['EModelAssignmentConfig', 'Entity'];
  generatorName: 'placeholder';
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

export interface MorphologyAssignmentConfig extends Entity {
  name: string;
  description: string;
  '@type': ['MorphologyAssignmentConfig', 'Entity'];
  generatorName: 'placeholder';
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
