import { atom } from 'jotai';
import sessionAtom from '../session';
import { ArticleListResult } from '@/api/explore-section/resources';
import { fetchArticlesForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';

export const getLiteratureArticlesForExperimentAndBrainRegions = (
  experimentName: string,
  brainRegions: string[],
  offset: number,
  signal: AbortSignal
) =>
  atom<Promise<ArticleListResult | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    return fetchArticlesForBrainRegionAndExperiment(
      session.accessToken,
      experimentName,
      brainRegions,
      offset,
      signal
    );
  });
