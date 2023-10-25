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

export const getExperimentTotalForBrainRegion = (brainRegionIds: string[]) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    const descendants = await get(getBrainRegionDescendants(brainRegionIds));

    const experimentToCount = await Promise.allSettled(
      EXPERIMENT_TYPE_DETAILS.map((experimentType) =>
        fetchExperimentDatasetCountForBrainRegion(
          session.accessToken,
          experimentType.id,
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
export const getLiteratureCountForBrainRegion = (brainRegionIds: string[]) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    const experimentToCount = await Promise.allSettled(
      EXPERIMENT_TYPE_DETAILS.map((experimentType) =>
        fetchParagraphsForBrainRegionAndExperiment(
          session.accessToken,
          { name: experimentType.title, id: experimentType.id },
          brainRegionIds
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
