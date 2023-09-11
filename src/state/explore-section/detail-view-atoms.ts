'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import pick from 'lodash/pick';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource } from '@/types/explore-section/resources';
import {
  Contributor,
  ExperimentalTrace,
  ExploreDeltaResource,
  LicenseResource,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/delta';
import { FetchParams } from '@/types/explore-section/application';
import { ensureArray } from '@/util/nexus';

export const infoAtom = atom<FetchParams | null>(null);

export const backToListPathAtom = atom<string | null | undefined>(null);

export const sessionAndInfoAtom = atom((get) => {
  const session = get(sessionAtom);
  const info = get(infoAtom);

  if (!session || !info) throw Error('Session or Info is invalid');

  return { session, info };
});

export const detailAtom = atom<Promise<ExploreDeltaResource>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);

  const resource: ExploreDeltaResource = await fetchResourceById(
    info.id,
    session,
    pick(info, ['org', 'project', 'rev'])
  );

  return resource;
});

export const contributorsDataAtom = atom<Promise<Contributor[] | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = await get(detailAtom);

  if (!detail || !detail.contribution) return null;

  const contributions = ensureArray(detail.contribution);

  const contributors = await Promise.all(
    contributions.map((contribution) =>
      fetchResourceById<ExploreDeltaResource>(
        contribution?.agent['@id'],
        session,
        pick(info, ['org', 'project'])
      )
    )
  );

  return contributors;
});

export const licenseDataAtom = atom<Promise<LicenseResource | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = (await get(detailAtom)) as ExperimentalTrace | ReconstructedNeuronMorphology;

  if (!detail || !detail.license) return null;

  const license = await fetchResourceById<LicenseResource>(
    detail.license['@id'],
    session,
    pick(info, ['org', 'project'])
  );

  return license;
});

export const latestRevisionAtom = atom<Promise<number | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);

  const latestRevision: DeltaResource = await fetchResourceById(
    info.id,
    session,
    pick(info, ['org', 'project'])
  );
  return latestRevision._rev;
});

export const speciesDataAtom = selectAtom(detailAtom, (detail) => detail.subject.species.label); // TODO: Find out whether Subject always has a "species", and whether species always has a label
