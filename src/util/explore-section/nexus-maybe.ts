import { FileMetadata } from '@/types/nexus';

const NEXUS_FILE_TYPE = 'File';

type PredicateFunction = (resource: FileMetadata) => boolean;

// Helper functions
// asks a question in a row and returns the combined booleans
export const chainPredicates = (predicates: PredicateFunction[]) => (resource: FileMetadata) =>
  predicates.reduce((memo, predicate) => memo && predicate(resource), true);

// returns opposite of the predicate
export const not = (predicate: PredicateFunction) => (resource: FileMetadata) =>
  !predicate(resource);

// Does this type match?
export const isOfType = (type: string) => (resource: FileMetadata) =>
  !!resource['@type'] && resource['@type'].includes(type);

// Get useful info about a resource

export const hasImage = (resource: FileMetadata) => !!resource._mediaType?.includes('image');

export const isFile = isOfType(NEXUS_FILE_TYPE);
