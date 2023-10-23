export function generateBrainRegionMTypeArray(brainRegionId: string, mTypeId: string) {
  return [brainRegionId, mTypeId];
}

export function generateBrainRegionMTypeMapKey(brainRegionId: string, mTypeId: string) {
  return generateMapKey(brainRegionId, mTypeId);
}

export function generateMapKey(str1: string, str2: string) {
  return `${str1}<>${str2}`;
}
