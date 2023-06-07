export interface Entity {
  '@id': string;
  '@type': string | string[];
  '@context': string | string[];
}

export type DateISOString = string;

export interface ResourceMetadata {
  _createdAt: DateISOString;
  _createdBy: string;
  _deprecated: boolean;
  _incoming: string;
  _outgoing: string;
  _project: string;
  _rev: number;
  _self: string;
  _updatedAt: DateISOString;
  _updatedBy: string;
}

export interface EntityResource extends ResourceMetadata, Entity {}

export type FileMetadata = {
  '@id': string;
  '@type': 'File';
  _bytes: number;
  _createdAt: DateISOString;
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

export interface Distribution {
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
}
