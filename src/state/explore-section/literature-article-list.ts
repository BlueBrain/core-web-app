import { atom } from 'jotai';
import sessionAtom from '../session';
import { fetchArticlesForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';
import { ArticleItem } from '@/api/explore-section/resources';

export const getLiteratureArticlesForExperimentAndBrainRegions = (
  experimentName: string,
  brainRegions: string[],
  page: number,
  signal: AbortSignal
) =>
  atom<Promise<{ articles: ArticleItem[]; currentPage: number; total: number } | null>>(
    async (get) => {
      const session = get(sessionAtom);
      if (!session) return null;
      return fetchArticlesForBrainRegionAndExperiment(
        session.accessToken,
        experimentName,
        brainRegions,
        page,
        signal
      );
    }
  );
