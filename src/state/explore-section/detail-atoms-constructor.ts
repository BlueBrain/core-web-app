'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource, FetchParams } from '@/types/explore-section';
import { ensureArray } from '@/util/nexus';

export const infoAtom = atom<FetchParams>({});

export const detailAtom = atom<Promise<DeltaResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const info = get(infoAtom);

  if (!session || !info.id || !info.org || !info.project) return null;

  const resource: DeltaResource = await fetchResourceById(
    info.id,
    session,
    pick(info, ['org', 'project', 'rev'])
  );

  return resource;
});

export const contributorsDataAtom = atom<Promise<DeltaResource[] | null>>(async (get) => {
  const session = get(sessionAtom);
  const info = get(infoAtom);
  const detail = await get(detailAtom);

  if (!session || !info.id || !info.org || !info.project || !detail || !detail.contribution)
    return null;

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
  const session = get(sessionAtom);
  const info = get(infoAtom);
  const detail = await get(detailAtom);

  if (!session || !info.id || !info.org || !info.project || !detail || !detail.license) return null;

  const license: DeltaResource = await fetchResourceById<DeltaResource>(
    detail.license['@id'],
    session,
    pick(info, ['org', 'project'])
  );

  return license;
});

export const latestRevisionAtom = atom<Promise<number | null>>(async (get) => {
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

export const speciesDataAtom = atom<Promise<DeltaResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const info = get(infoAtom);
  const detail = await get(detailAtom);

  if (!session || !info.id || !info.org || !info.project || !detail || !detail.subject) return null;

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
