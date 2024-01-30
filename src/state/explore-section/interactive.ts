import { atom } from 'jotai';
import sessionAtom from '@/state/session';
import { ExperimentDatasetCountPerBrainRegion } from '@/api/explore-section/resources';
import { fetchParagraphCountForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';

export const getLiteratureCountForBrainRegion = (brainRegion: string, signal: AbortSignal) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    return await Promise.allSettled(
      Object.entries(EXPERIMENT_DATA_TYPES).map(([id, config]) =>
        fetchParagraphCountForBrainRegionAndExperiment(
          { name: config.title, id },
          brainRegion,
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
