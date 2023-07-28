import { IdType } from '@/types/nexus';

export const metadataKeys = [
  '_constrainedBy',
  '_createdAt',
  '_createdBy',
  '_deprecated',
  '_incoming',
  '_outgoing',
  '_project',
  '_rev',
  '_schemaProject',
  '_self',
  '_updatedAt',
  '_updatedBy',
];

export const schemas: Partial<Record<IdType, string>> = {};
