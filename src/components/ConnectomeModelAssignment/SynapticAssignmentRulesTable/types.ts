import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';

export interface IndexedSynapticAssignmentRule extends SynapticAssignmentRule {
  /** Used as unique id for Drag & Drop. Should be `index` as a string. */
  key: string;
  /** Index from the original (not yet filtered nor ordered) array. */
  index: number;
}
