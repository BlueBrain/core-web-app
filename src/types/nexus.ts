export type BaseEntity = {
  '@id': string;
  '@type': string | string[];
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
};

export type Circuit = BaseEntity & {
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
};
