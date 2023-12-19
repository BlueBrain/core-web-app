import { atom } from 'jotai';
import sessionAtom from '@/state/session';
import { ExperimentDatasetCountPerBrainRegion } from '@/api/explore-section/resources';
import { EXPERIMENT_DATA_TYPES_NO_SC } from '@/constants/explore-section/experiment-types';
import { fetchParagraphCountForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';

export const getLiteratureCountForBrainRegion = (brainRegionNames: string[], signal: AbortSignal) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    return await Promise.allSettled(
      Object.entries(EXPERIMENT_DATA_TYPES_NO_SC).map(([id, config]) =>
        fetchParagraphCountForBrainRegionAndExperiment(
          session.accessToken,
          { name: config.title, id },
          brainRegionNames,
          signal
        )
      )
    ).then((accumulatedResponse) => {
      const experimentTypeToTotal: Record<string, ExperimentDatasetCountPerBrainRegion> = {};

      accumulatedResponse?.forEach((response) => {
        if (response.status === 'fulfilled') {
          experimentTypeToTotal[response.value.experimentUrl] = { ...response.value };
        }
      });

      return experimentTypeToTotal;
    });
  });
