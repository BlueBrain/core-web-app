import { BRAIN_REGION_URI_BASE } from '@/util/brain-hierarchy';

export function expandBrainRegionId(brainRegionId: string) {
  const fullBrainRegionId = `${BRAIN_REGION_URI_BASE}/${brainRegionId}`;
  return fullBrainRegionId;
}

export function generateBrainMTypePairPath(brainRegionId: string, mTypeId: string) {
  if (brainRegionId.startsWith('http')) {
    return [brainRegionId, mTypeId];
  }
  return [expandBrainRegionId(brainRegionId), mTypeId];
}

export function generateBrainMTypeMapKey(brainRegionId: string, mTypeId: string) {
  if (brainRegionId.startsWith('http')) {
    return `${brainRegionId}<>${mTypeId}`;
  }
  return `${expandBrainRegionId(brainRegionId)}<>${mTypeId}`;
}
