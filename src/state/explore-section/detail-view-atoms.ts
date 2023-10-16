'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import { atomFamily } from 'jotai/utils';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource } from '@/types/explore-section/resources';
import { ensureArray } from '@/util/nexus';
import { ResourceInfo } from '@/types/explore-section/application';

export const backToListPathAtom = atom<string | null | undefined>(null);

export const sessionAndInfoAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom((get) => {
    const session = get(sessionAtom);

    if (!session || !resourceInfo) throw Error('Session or Info is invalid');

    return { session, info: resourceInfo as ResourceInfo };
  })
);

export const detailAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<DeltaResource | null>>(async (get) => {
    const { session, info } = get(sessionAndInfoAtom(resourceInfo));
    const resource: DeltaResource = await fetchResourceById(info.id, session, {
      org: info.org,
      project: info.project,
      rev: info.rev ? Number.parseInt(info.rev as string, 10) : undefined,
    });

    return resource;
  })
);

export const contributorsDataAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<DeltaResource[] | null>>(async (get) => {
    const { session, info } = get(sessionAndInfoAtom(resourceInfo));
    const detail = await get(detailAtom(resourceInfo));

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
  })
);

export const licenseDataAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<DeltaResource | null>>(async (get) => {
    const { session, info } = get(sessionAndInfoAtom(resourceInfo));
    const detail = await get(detailAtom(resourceInfo));

    if (!detail || !detail.license) return null;

    const license: DeltaResource = await fetchResourceById<DeltaResource>(
      detail.license['@id'],
      session,
      pick(info, ['org', 'project'])
    );

    return license;
  })
);

export const latestRevisionAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<number | null>>(async (get) => {
    const { session, info } = get(sessionAndInfoAtom(resourceInfo));

    const latestRevision: DeltaResource = await fetchResourceById(
      info.id,
      session,
      pick(info, ['org', 'project'])
    );
    return latestRevision._rev;
  })
);

export const speciesDataAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<DeltaResource | null>>(async (get) => {
    const { session, info } = get(sessionAndInfoAtom(resourceInfo));

    const detail = await get(detailAtom(resourceInfo));

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
  })
);
