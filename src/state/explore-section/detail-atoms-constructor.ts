'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { DeltaResource, FetchParams, DetailAtomResource } from '@/types/explore-section';

/**
 * DeltaResource is the raw data interface recived from a reequest to nexus
 * DetailAtomResource used by the detailAtom variable extends DeltaResource using response from formatContributors
 * @param {import("./types/explore-section").DeltaResource} contributor
 */
const formatContributors = (contributor: DeltaResource | null): string => {
  if (!contributor) return '';

  const { name, familyName, givenName, '@id': id, '@type': type } = contributor;

  if (type && type.includes('Organization')) return '';
  if (name) return name;
  if (familyName && givenName) return `${givenName} ${familyName}`;

  return id;
};

const createDetailAtoms = () => {
  const infoAtom = atom<FetchParams>({});

  const detailAtom = atom<Promise<DetailAtomResource | null>>(async (get) => {
    const session = get(sessionAtom);
    const info = get(infoAtom);

    if (!session || !info.id || !info.org || !info.project) return null;

    const resource: DetailAtomResource | null = await fetchResourceById(
      info.id,
      session,
      pick(info, ['org', 'project', 'rev'])
    );

    if (resource && resource.contribution) {
      const contributions = Array.isArray(resource.contribution)
        ? resource.contribution
        : [resource.contribution];

      const contributors = await Promise.all(
        contributions.map((contribution) =>
          fetchResourceById(
            contribution.agent['@id'],
            session,
            pick(info, ['org', 'project', 'rev'])
          )
        )
      );

      resource.contributors = contributors
        .map((contributor) => formatContributors(contributor as DeltaResource | null))
        .filter((contributor) => contributor !== '');
    }

    return resource;
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

  return {
    infoAtom,
    detailAtom,
    latestRevisionAtom,
  };
};

export default createDetailAtoms;
