'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import {
  subjectAgeSelectorFn,
  subjectSpeciesSelectorFn,
  contributorSelectorFn,
  weightSelectorFn,
  eTypeSelectorFn,
  mTypeSelectorFn,
  semSelectorFn,
  numberOfMeasurementSelectorFn,
} from './selector-functions';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource, FetchParams } from '@/types/explore-section';
import { ensureArray } from '@/util/nexus';

const createDetailAtoms = () => {
  const infoAtom = atom<FetchParams>({});

  const rawDetailAtom = atom<Promise<DeltaResource | null>>(async (get) => {
    const session = get(sessionAtom);
    const info = get(infoAtom);

    if (!session || !info.id || !info.org || !info.project) return null;

    const resource: DeltaResource | null = await fetchResourceById(
      info.id,
      session,
      pick(info, ['org', 'project', 'rev'])
    );

    return resource;
  });

  const contributorsDataAtom = atom<Promise<DeltaResource[] | []>>(async (get) => {
    const session = get(sessionAtom);
    const info = get(infoAtom);
    const detail = await get(rawDetailAtom);

    if (!session || !info.id || !info.org || !info.project || !detail || !detail.contribution)
      return [];

    const contributions = ensureArray(detail.contribution);

    const contributors = await Promise.all(
      contributions.map((contribution) =>
        fetchResourceById<DeltaResource>(
          contribution?.agent['@id'],
          session,
          pick(info, ['org', 'project'])
        )
      )
    );

    return contributors;
  });

  const latestRevisionAtom = atom<Promise<number | null>>(async (get) => {
    const session = get(sessionAtom);
    const info = get(infoAtom);

    if (!session || !info.id || !info.org || !info.project) return null;

    const latestRevision: DeltaResource = await fetchResourceById(
      info.id,
      session,
      pick(info, ['org', 'project'])
    );
    return latestRevision._rev;
  });

  const contributorsAtom = selectAtom(contributorsDataAtom, contributorSelectorFn);

  const selectDetail = (
    detail: DeltaResource | null,
    key: string,
    selectorFn: (detail: DeltaResource | null) => any
  ) => {
    atom(selectorFn(detail?.[key]));
  };

  const detailAtom = atom<Promise<any | null>>(async (get) => {
    const rawDetail = await get(rawDetailAtom);
    return merge(rawDetail, {
      numberOfMeasurement: selectDetail(
        rawDetail,
        'numberOfMeasurement',
        numberOfMeasurementSelectorFn
      ),
      subjectSpecies: selectDetail(rawDetail, 'subjectSpecies', subjectSpeciesSelectorFn),
      subjectAge: selectDetail(rawDetail, 'subjectAge', subjectAgeSelectorFn),
      weight: selectDetail(rawDetail, 'weight', weightSelectorFn),
      mType: selectDetail(rawDetail, 'mType', mTypeSelectorFn),
      eType: selectDetail(rawDetail, 'eType', eTypeSelectorFn),
      latestRevision: await get(latestRevisionAtom),
      contributors: await get(contributorsAtom),
      sem: selectDetail(rawDetail, 'sem', semSelectorFn),
    });
  });

  return {
    infoAtom,
    detailAtom,
    contributorsAtom,
    latestRevisionAtom,
  };
};

export default createDetailAtoms;
