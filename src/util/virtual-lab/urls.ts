export function generateLabUrl(virtualLabId: string) {
  return `/virtual-lab/lab/${virtualLabId}`;
}

export function generateVlProjectUrl(virtualLabId: string, projectId: string) {
  return `/virtual-lab/lab/${virtualLabId}/project/${projectId}`;
}
