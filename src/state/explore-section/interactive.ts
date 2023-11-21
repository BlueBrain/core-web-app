import { atom } from 'jotai';
import { getBrainRegionDescendants } from '../brain-regions/descendants';
import sessionAtom from '@/state/session';
import {
  ExperimentDatasetCountPerBrainRegion,
  fetchExperimentDatasetCountForBrainRegion,
} from '@/api/explore-section/resources';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';
import { fetchParagraphCountForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';

export const getExperimentTotalForBrainRegion = (brainRegionIds: string[], signal: AbortSignal) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    const descendants = await get(getBrainRegionDescendants(brainRegionIds));

    const experimentToCount = await Promise.allSettled(
      EXPERIMENT_TYPE_DETAILS.map((experimentType) =>
        fetchExperimentDatasetCountForBrainRegion(
          session.accessToken,
          experimentType.id,
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

    const experimentToCount = await Promise.allSettled(
      EXPERIMENT_TYPE_DETAILS.map((experimentType) =>
        fetchParagraphCountForBrainRegionAndExperiment(
          session.accessToken,
          { name: experimentType.title, id: experimentType.id },
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

    return experimentToCount;
  });
