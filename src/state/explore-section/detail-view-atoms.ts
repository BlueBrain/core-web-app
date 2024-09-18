'use client';

import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import sessionAtom from '@/state/session';
import { fetchResourceById, queryES } from '@/api/nexus';
import { DeltaResource, Contributor, Subject, ModelUsed } from '@/types/explore-section/resources';
import { Contributor as DeltaContributor } from '@/types/explore-section/delta-contributor';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
  Experiment,
} from '@/types/explore-section/delta-experiment';
import { ensureArray } from '@/util/nexus';
import { ResourceInfo } from '@/types/explore-section/application';
import { getLicenseByIdQuery } from '@/queries/es';
import { subjectAgeSelectorFn, ageSelectorFn } from '@/util/explore-section/selector-functions';
import { atlasESView, nexus } from '@/config';
import { DataType } from '@/constants/explore-section/list-views';
import { MEModelResource } from '@/types/me-model';
import { fetchLinkedMandEModels } from '@/api/explore-section/resources';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';

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

export const detailFamily = atomFamily<ResourceInfo, Atom<Promise<DeltaResource>>>(
  (resourceInfo) =>
    atom(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));
      const resource = await fetchResourceById<DeltaResource>(
        info.id,
        session,
        info.id.startsWith(nexus.defaultIdBaseUrl)
          ? { rev: info.rev }
          : {
              org: info.org,
              project: info.project,
              rev: info.rev,
            }
      );

      if (
        ensureArray(resource['@type']).includes(DataType.SingleNeuronSynaptome) &&
        'used' in resource
      ) {
        const meModelId = (resource.used as ModelUsed)['@id'];
        const linkedMeModel = await fetchResourceById<MEModelResource>(meModelId, session, {
          ...(meModelId.startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org: info.org,
                project: info.project,
              }),
        });

        const { linkedMModel, linkedEModel } = await fetchLinkedMandEModels({
          org: info.org,
          project: info.project,
          meModel: linkedMeModel,
        });

        return {
          ...resource,
          linkedMeModel,
          linkedMModel,
          linkedEModel,
        };
      }
      if (
        ensureArray(resource['@type']).includes(DataType.SingleNeuronSynaptomeSimulation) &&
        'used' in resource &&
        ensureArray(resource.used['@type']).includes('SingleNeuronSynaptome')
      ) {
        const synaptomeModelId = resource.used['@id'];
        const linkedsynaptomeModelModel = await fetchResourceById<SynaptomeModelResource>(
          synaptomeModelId,
          session,
          {
            ...(synaptomeModelId.startsWith(nexus.defaultIdBaseUrl)
              ? {}
              : {
                  org: info.org,
                  project: info.project,
                }),
          }
        );
        const meModelId = linkedsynaptomeModelModel.used['@id'];
        const linkedMeModel = await fetchResourceById<MEModelResource>(meModelId, session, {
          ...(meModelId.startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org: info.org,
                project: info.project,
              }),
        });

        const { linkedMModel, linkedEModel } = await fetchLinkedMandEModels({
          org: info.org,
          project: info.project,
          meModel: linkedMeModel,
        });

        return {
          ...resource,
          linkedMeModel,
          linkedMModel,
          linkedEModel,
        };
      }
      if (
        ensureArray(resource['@type']).includes(DataType.SingleNeuronSimulation) &&
        'used' in resource &&
        ensureArray(resource.used['@type']).includes('MEModel')
      ) {
        const meModelId = resource.used['@id'];
        const linkedMeModel = await fetchResourceById<MEModelResource>(meModelId, session, {
          ...(meModelId.startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org: info.org,
                project: info.project,
              }),
        });

        const { linkedMModel, linkedEModel } = await fetchLinkedMandEModels({
          org: info.org,
          project: info.project,
          meModel: linkedMeModel,
        });

        return {
          ...resource,
          linkedMeModel,
          linkedMModel,
          linkedEModel,
        };
      }
      return resource;
    }),
  isEqual
);

export const contributorsDataFamily = atomFamily<
  ResourceInfo,
  Atom<Promise<DeltaContributor[] | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));
      const detail = (await get(detailFamily(resourceInfo))) as Experiment;

      if (!detail || !detail.contribution) return null;

      const contributions = ensureArray(detail.contribution);

      const contributors = await Promise.all(
        contributions.map(async (contribution) => {
          if (contribution?.agent?.name)
            return pick(contribution.agent, ['@id', '@type', 'name']) as Contributor;

          return fetchResourceById<Contributor>(
            contribution?.agent['@id'],
            session,
            pick(info, ['org', 'project'])
          );
        })
      );

      return contributors;
    }),
  isEqual
);

export const licenseDataFamily = atomFamily<ResourceInfo, Atom<Promise<string | null>>>(
  (resourceInfo) =>
    atom(async (get) => {
      const detail = (await get(detailFamily(resourceInfo))) as
        | ExperimentalTrace
        | ReconstructedNeuronMorphology;
      const session = get(sessionAtom);

      if (!detail || !detail.license || !session) throw new Error('No license found');

      const licenseQuery = getLicenseByIdQuery(detail.license['@id']);
      const [license] = await queryES<{ label: string }>(licenseQuery, session, {
        org: atlasESView.org,
        project: atlasESView.project,
        viewId: atlasESView.id,
      });
      return license.label || detail.license['@id'];
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

export const speciesDataFamily = atomFamily<ResourceInfo, Atom<Promise<Experiment | null>>>(
  (resourceInfo) =>
    atom(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));

      const detail = (await get(detailFamily(resourceInfo))) as Experiment;

      if (!detail || !detail.subject) return null;

      if (detail.subject?.species?.label) return detail;

      const subject = await fetchResourceById<Experiment>(
        detail.subject['@id'],
        session,
        pick(info, ['org', 'project'])
      );

      return subject;
    }),
  isEqual
);

export const subjectAgeDataFamily = atomFamily<ResourceInfo, Atom<Promise<string | null>>>(
  (resourceInfo) =>
    atom(async (get) => {
      const { session, info } = get(sessionAndInfoFamily(resourceInfo));

      const detail = (await get(detailFamily(resourceInfo))) as Experiment;

      if (!detail || !detail.subject) return null;

      if (detail.subject) return subjectAgeSelectorFn(detail);

      if (detail.subject['@id']) {
        const subject = await fetchResourceById<Subject>(
          detail.subject['@id'],
          session,
          pick(info, ['org', 'project'])
        );

        return ageSelectorFn(subject);
      }

      return null;
    }),
  isEqual
);
