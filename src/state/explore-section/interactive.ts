import { atomWithReset } from 'jotai/utils';
import { atom } from 'jotai';
import { getBrainRegionDescendants } from '../brain-regions/descendants';
import sessionAtom from '@/state/session';
import {
  ExperimentDatasetCountPerBrainRegion,
  fetchExperimentDatasetCountForBrainRegion,
} from '@/api/explore-section/resources';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';
import { fetchParagraphsForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';

// Keeps track of the visible interactive brain regions
export const visibleExploreBrainRegionsAtom = atomWithReset<string[]>([]);

export const getExperimentTotalForBrainRegion = (brainRegionId: string) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const descendants = await get(getBrainRegionDescendants([brainRegionId]));

    const experimentToCount = await Promise.allSettled(
      EXPERIMENT_TYPE_DETAILS.map((experimentType) =>
        fetchExperimentDatasetCountForBrainRegion(
          session.accessToken,
          experimentType.id,
          brainRegionId,
          descendants ?? []
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

// NOTE: This atom uses mock results of an ML api that is yet to be finalized.
export const getLiteratureCountForBrainRegion = (brainRegionId: string) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const descendants = await get(getBrainRegionDescendants([brainRegionId]));

    const experimentToCount = await Promise.allSettled(
      EXPERIMENT_TYPE_DETAILS.map((experimentType) =>
        fetchParagraphsForBrainRegionAndExperiment(
          session.accessToken,
          experimentType.id,
          { name: experimentType.title, id: experimentType.id },
          descendants ?? []
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
