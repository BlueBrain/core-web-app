export interface Entity {
  '@id': string;
  '@type': string | string[];
  '@context': string | string[];
}

export interface ResourceMetadata {
  _createdAt: string;
  _createdBy: string;
  _deprecated: boolean;
  _incoming: string;
  _outgoing: string;
  _project: string;
  _rev: number;
  _self: string;
  _updatedAt: string;
  _updatedBy: string;
}

export interface EntityResource extends ResourceMetadata, Entity {}

export type FileMetadata = {
  '@id': string;
  '@type': 'File';
  _bytes: number;
  _createdAt: string;
  _createdBy: string;
  _deprecated: boolean;
  _digest: {
    _algorithm: string;
    _value: string;
  };
  _filename: string;
  _mediaType: string;
  _project: string;
  _rev: number;
  _self: string;
  _storage: {
    '@id': string;
    '@type': 'DiskStorage';
    _rev: number;
  };
  _updatedAt: string;
  _updatedBy: string;
};

export interface Circuit extends Entity {
  brainLocation?: {
    brainRegion?: {
      '@id': string;
      label: string;
    };
  };
  circuitBase: {
    '@type': string;
    url: string;
  };
  circuitConfigPath: {
    '@type': string;
    url: string;
  };
  name: string;
  description: string;
  circuitType: string;
}

export interface CircuitResource extends ResourceMetadata, Circuit {}

export interface Campaign {
  id: string;
  org: string;
  self: string;
  name: string;
  project: string;
  status?: string;
  description?: string;
  configuration?: string;
  dimensions?: string;
  startedAt?: string;
  updatedAt?: string;
  endedAt?: string;
  createdAt?: string;
  attributes?: string;
  updatedBy?: string;
  tags?: string[];
}

export interface Dimension {
  key: string;
  dimensionValues: string;
  startedAt: string;
  endedAt: string;
  status: string;
}

export interface BrainModelConfig extends Entity {
  name: string;
  description: string;
  cellCompositionConfig?: {
    '@id': string;
  };
  cellPositionConfig?: {
    '@id': string;
  };
}

export interface BrainModelConfigResource extends ResourceMetadata, BrainModelConfig {}

export interface CellCompositionConfig extends Entity {
  name: string;
  description: string;
  distribution: {
    '@type': 'DataDownload';
    name: string;
    encodingFormat: string;
    contentSize: {
      unitCode: 'bytes';
      value: number;
    };
    contentUrl: string;
    digest: {
      algorithm: string;
      value: string;
    };
  };
}

export interface CellCompositionConfigResource extends ResourceMetadata, CellCompositionConfig {}

type EtypeWorkflowConfigEntry = {
  label: string;
  about: string;
  density: number;
  count: number;
};

type MtypeWorkflowConfigEntry = {
  label: string;
  about: string;
  hasPart: Record<string, EtypeWorkflowConfigEntry>;
};

export type CompositionOverridesWorkflowConfig = Record<string, MtypeWorkflowConfigEntry>;

export type CellCompositionConfigPayload = {
  [entityId: string]: {
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
}

export interface CellPositionConfigResource extends ResourceMetadata, CellPositionConfig {}
