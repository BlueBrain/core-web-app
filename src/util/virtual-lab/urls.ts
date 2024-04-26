import { basePath } from '@/config';

export function generateLabUrl(virtualLabId: string) {
  return `${basePath}/virtual-lab/lab/${virtualLabId}`;
}

export function generateVlProjectUrl(virtualLabId: string, projectId: string) {
  return `${basePath}/virtual-lab/lab/${virtualLabId}/project/${projectId}`;
}
