import { atom } from 'jotai';
import sessionAtom from '../session';
import { fetchArticlesForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';
import { ArticleItem } from '@/api/explore-section/resources';

export const getLiteratureArticlesForExperimentAndBrainRegions = (
  experimentName: string,
  brainRegions: string[],
  signal: AbortSignal
) =>
  atom<Promise<ArticleItem[] | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    return fetchArticlesForBrainRegionAndExperiment(
      session.accessToken,
      experimentName,
      brainRegions,
      signal
    );
  });
