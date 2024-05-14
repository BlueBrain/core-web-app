import { useMemo } from 'react';
import { ensureArray } from './nexus';

interface ResourceDistribution {
  encodingFormat: string;
  contentUrl: string;
}

export function useSwcContentUrl(
  resourceDistribution: ResourceDistribution | ResourceDistribution[]
): string | undefined {
  return useContentUrl(resourceDistribution, 'application/swc');
}

export function useContentUrl(
  resourceDistribution: ResourceDistribution | ResourceDistribution[],
  encodingFormat: string
): string | undefined {
  return useMemo(() => {
    const distributions = ensureArray(resourceDistribution);
    for (const distribution of distributions) {
      if (distribution.encodingFormat === encodingFormat) {
        return distribution.contentUrl;
      }
    }
    // There is no SWC content URL in this resource.
    return undefined;
  }, [encodingFormat, resourceDistribution]);
}
