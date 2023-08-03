import { BRAIN_REGION_URI_BASE } from '@/util/brain-hierarchy';

export function expandBrainRegionId(brainRegionId: string) {
  const fullBrainRegionId = `${BRAIN_REGION_URI_BASE}/${brainRegionId}`;
  return fullBrainRegionId;
}

export function generateBrainRegionMTypeArray(brainRegionId: string, mTypeId: string) {
  if (brainRegionId.startsWith('http')) {
    return [brainRegionId, mTypeId];
  }
  return [expandBrainRegionId(brainRegionId), mTypeId];
}

export function generateBrainRegionMTypeMapKey(brainRegionId: string, mTypeId: string) {
  if (brainRegionId.startsWith('http')) {
    return generateMapKey(brainRegionId, mTypeId);
  }
  return generateMapKey(expandBrainRegionId(brainRegionId), mTypeId);
}

export function generateMapKey(str1: string, str2: string) {
  return `${str1}<>${str2}`;
}
