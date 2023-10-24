'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import { atomFamily } from 'jotai/utils';
import isEqual from 'lodash/isEqual';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource } from '@/types/explore-section/resources';
import { ensureArray } from '@/util/nexus';
import { ResourceInfo } from '@/types/explore-section/application';

export const backToListPathAtom = atom<string | null | undefined>(null);

export const sessionAndInfoFamily = atomFamily(
  (resourceInfo?: ResourceInfo) =>
    atom((get) => {
      const session = get(sessionAtom);

      if (!session || !resourceInfo) throw Error('Session or Info is invalid');

      return { session, info: resourceInfo as ResourceInfo };
    }),
  isEqual
);

export const detailFamily = atomFamily(
  <T>(resourceInfo?: ResourceInfo) =>
    atom<Promise<DeltaResource<T> | null>>(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));
      const resource: DeltaResource<T> = await fetchResourceById(info.id, session, {
        org: info.org,
        project: info.project,
        rev: info.rev,
      });

      return resource;
    }),
  isEqual
);

export type Contributor = DeltaResource<{ familyName: string; givenName: string }>;

export const contributorsDataFamily = atomFamily(
  (resourceInfo?: ResourceInfo) =>
    atom(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));
      const detail = await get(detailFamily(resourceInfo));

      if (!detail || !detail.contribution) return null;

      const contributions = ensureArray(detail.contribution);

      const contributors = await Promise.all(
        contributions.map((contribution) =>
          fetchResourceById<Contributor>(
            contribution?.agent['@id'],
            session,
            pick(info, ['org', 'project'])
          )
        )
      );

      return contributors;
    }),
  isEqual
);

export const licenseDataFamily = atomFamily(
  (resourceInfo?: ResourceInfo) =>
    atom<Promise<DeltaResource | null>>(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));
      const detail = await get(detailFamily(resourceInfo));

      if (!detail || !detail.license) return null;

      const license: DeltaResource = await fetchResourceById<DeltaResource>(
        detail.license['@id'],
        session,
        pick(info, ['org', 'project'])
      );

      return license;
    }),
  isEqual
);

export const latestRevisionFamily = atomFamily(
  (resourceInfo?: ResourceInfo) =>
    atom<Promise<number | null>>(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));

      const latestRevision: DeltaResource = await fetchResourceById(
        info.id,
        session,
        pick(info, ['org', 'project'])
      );
      return latestRevision._rev;
    }),
  isEqual
);

export const speciesDataFamily = atomFamily(
  (resourceInfo?: ResourceInfo) =>
    atom<Promise<DeltaResource | null>>(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));

      const detail = await get(detailFamily(resourceInfo));

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
    }),
  isEqual
);
