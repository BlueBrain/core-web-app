import { atom } from 'jotai';
import sessionAtom from '@/state/session';
import { ExperimentDatasetCountPerBrainRegion } from '@/api/explore-section/resources';
import { fetchParagraphCountForBrainRegionAndExperiment } from '@/components/explore-section/Literature/api';
import { filterDataTypes } from '@/util/explore-section/data-types';
import { DataGroups } from '@/types/explore-section/data-groups';

export const getLiteratureCountForBrainRegion = (brainRegionNames: string[], signal: AbortSignal) =>
  atom<Promise<Record<string, ExperimentDatasetCountPerBrainRegion> | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    return await Promise.allSettled(
      filterDataTypes([DataGroups.Literature]).map((dataType) =>
        fetchParagraphCountForBrainRegionAndExperiment(
          session.accessToken,
          { name: dataType.title, id: dataType.key },
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
