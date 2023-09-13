'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { EntityResource } from '@/types/nexus/common';
import { Contributor } from '@/types/explore-section/delta-contributor';
import {
  Experiment,
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/delta-experiment';
import { License } from '@/types/explore-section/delta-license';
import { Subject } from '@/types/explore-section/delta-properties';
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

export const detailAtom = atom<Promise<EntityResource | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);

  const resource = await fetchResourceById<EntityResource>(
    info.id,
    session,
    pick(info, ['org', 'project', 'rev'])
  );

  return resource;
});

export const contributorsDataAtom = atom<Promise<Contributor[] | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = (await get(detailAtom)) as Experiment;

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
});

export const licenseDataAtom = atom<Promise<License | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = (await get(detailAtom)) as ExperimentalTrace | ReconstructedNeuronMorphology;

  if (!detail || !detail.license) return null;

  const license = await fetchResourceById<License>(
    detail.license['@id'],
    session,
    pick(info, ['org', 'project'])
  );

  return license;
});

export const latestRevisionAtom = atom<Promise<number | null>>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);

  const latestRevision = await fetchResourceById<EntityResource>(
    info.id,
    session,
    pick(info, ['org', 'project'])
  );
  return latestRevision._rev;
});

export const speciesDataAtom = atom<
  Promise<Experiment | (EntityResource & { subject: Subject }) | null>
>(async (get) => {
  const { session, info } = get(sessionAndInfoAtom);
  const detail = (await get(detailAtom)) as Experiment;

  if (!detail) return null;

  if (detail.subject.species.label) return detail;

  if (detail.subject.species['@id']) {
    const subject = await fetchResourceById<EntityResource & { subject: Subject }>(
      detail.subject.species['@id'],
      session,
      pick(info, ['org', 'project'])
    );

    return subject;
  }

  return null;
});
