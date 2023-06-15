'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource } from '@/types/explore-section/resources';
import { FetchParams } from '@/types/explore-section/application';
import { ensureArray } from '@/util/nexus';

export const infoAtom = atom<FetchParams | null>(null);

export const sessionAndInfoAtom = atom((get) => {
  const session = get(sessionAtom);
  const info = get(infoAtom);

  if (!session || !info) throw Error('Session or Info is invalid');

  return { session, info };
});

export const detailAtom = atom<Promise<DeltaResource | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);

  const resource: DeltaResource = await fetchResourceById(
    info.id,
    session,
    pick(info, ['org', 'project', 'rev'])
  );

  return resource;
});

export const contributorsDataAtom = atom<Promise<DeltaResource[] | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = await get(detailAtom);

  if (!detail || !detail.contribution) return null;

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

export const licenseDataAtom = atom<Promise<DeltaResource | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = await get(detailAtom);

  if (!detail || !detail.license) return null;

  const license: DeltaResource = await fetchResourceById<DeltaResource>(
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

export const speciesDataAtom = atom<Promise<DeltaResource | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = await get(detailAtom);

  if (!detail || !detail.subject) return null;

  if (detail.subject?.species?.label) return detail;

  if (detail.subject['@id']) {
    const subject: DeltaResource = await fetchResourceById<DeltaResource>(
      detail.subject['@id'],
      session,
      pick(info, ['org', 'project'])
    );

    return subject;
  }

  return null;
});
