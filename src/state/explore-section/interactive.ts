import { atom } from 'jotai';
import { getBrainRegionDescendants } from '../brain-regions/descendants';
import sessionAtom from '@/state/session';
import {
  ExperimentDatasetCountPerBrainRegion,
  fetchExperimentDatasetCountForBrainRegion,
} from '@/api/explore-section/resources';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { fetchParagraphCountForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';

export const getExperimentTotalForBrainRegion = (brainRegionIds: string[], signal: AbortSignal) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    const descendants = await get(getBrainRegionDescendants(brainRegionIds));

    const experimentToCount = await Promise.allSettled(
      Object.keys(EXPERIMENT_DATA_TYPES).map((id) =>
        fetchExperimentDatasetCountForBrainRegion(
          session.accessToken,
          id,
          descendants ?? [],
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

    return experimentToCount;
  });

export const getLiteratureCountForBrainRegion = (brainRegionNames: string[], signal: AbortSignal) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    return await Promise.allSettled(
      Object.entries(EXPERIMENT_DATA_TYPES).map(([id, config]) =>
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
