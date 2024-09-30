import esb from 'elastic-builder';
import isEqual from 'lodash/isEqual';
import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { fetchResourceById, fetchResourceByIdUsingResolver } from '@/api/nexus';
import {
  EModelConfiguration,
  EModelWorkflow,
  ExemplarMorphologyDataType,
  ExperimentalTracesDataType,
  ExtractionTargetsConfiguration,
} from '@/types/e-model'; // TODO: Confirm these types
import { EModelResource } from '@/types/explore-section/delta-model';

import { ReconstructedNeuronMorphology } from '@/types/explore-section/delta-experiment';
import sessionAtom from '@/state/session';
import { convertDeltaMorphologyForUI, convertESTraceForUI } from '@/services/e-model';
import { ensureArray } from '@/util/nexus';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { createHeaders } from '@/util/utils';
import { ExperimentalTrace } from '@/types/explore-section/es-experiment';

export type ModelResourceInfo = {
  eModelId: string;
  projectId: string;
  virtualLabId: string;
};

export const eModelFamily = atomFamily<ModelResourceInfo, Atom<Promise<EModelResource | null>>>(
  (resourceInfo) =>
    atom(async (get) => {
      const { eModelId, projectId, virtualLabId } = resourceInfo;

      const session = get(sessionAtom);

      if (!session) return null;

      const model = await fetchResourceByIdUsingResolver<EModelResource>(eModelId, session, {
        project: projectId,
        org: virtualLabId,
      });

      return model;
    }),
  isEqual
);

export const eModelWorkflowFamily = atomFamily<
  ModelResourceInfo,
  Atom<Promise<EModelWorkflow | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const eModel = await get(eModelFamily(resourceInfo));
      const session = get(sessionAtom);

      if (!eModel || !session) return null;

      const { '@id': followedWorkflowId } = eModel.generation.activity.followedWorkflow;

      const followedWorkflow = await fetchResourceByIdUsingResolver<EModelWorkflow>(
        followedWorkflowId,
        session,
        { org: resourceInfo.virtualLabId, project: resourceInfo.projectId }
      );

      return followedWorkflow;
    }),
  isEqual
);

export const eModelConfigurationFamily = atomFamily<
  ModelResourceInfo,
  Atom<Promise<EModelConfiguration | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const followedWorkflow = await get(eModelWorkflowFamily(resourceInfo));
      const session = get(sessionAtom);

      if (!followedWorkflow || !session) return null;

      const eModelConfigurationPart = ensureArray(followedWorkflow.hasPart).find(
        ({ '@type': type }) => type === 'EModelConfiguration'
      );

      const { '@id': eModelConfigurationId } = eModelConfigurationPart ?? {};

      if (!eModelConfigurationId) return null;

      const eModelConfiguration = await fetchResourceByIdUsingResolver<EModelConfiguration>(
        eModelConfigurationId,
        session,
        { org: resourceInfo.virtualLabId, project: resourceInfo.projectId }
      );

      return eModelConfiguration;
    }),
  isEqual
);

export const eModelExemplarMorphologyFamily = atomFamily<
  Omit<ModelResourceInfo, 'eModelId'> & { eModelId?: string },
  Atom<Promise<ExemplarMorphologyDataType | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      if (!resourceInfo.eModelId) return null;

      const eModelConfiguration = await get(
        eModelConfigurationFamily(resourceInfo as ModelResourceInfo)
      );
      const session = get(sessionAtom);

      if (!eModelConfiguration || !session) return null;

      const exemplarMorphologyId = eModelConfiguration.uses.find(
        ({ '@type': type }) => type === 'NeuronMorphology'
      )?.['@id'];

      if (!exemplarMorphologyId) return null;

      const exemplarMorphology =
        await fetchResourceByIdUsingResolver<ReconstructedNeuronMorphology>(
          exemplarMorphologyId,
          session,
          { org: resourceInfo.virtualLabId, project: resourceInfo.projectId }
        );

      return convertDeltaMorphologyForUI(exemplarMorphology);
    }),
  isEqual
);

const eModelExtractionTargetsConfigurationIdAtom = atomFamily<
  ModelResourceInfo,
  Atom<Promise<string | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const eModelWorkflow = await get(eModelWorkflowFamily(resourceInfo));

      if (!eModelWorkflow) return null;

      const extractionTargetsConfiguration = ensureArray(eModelWorkflow.hasPart).find(
        (part) => part['@type'] === 'ExtractionTargetsConfiguration'
      );

      if (!extractionTargetsConfiguration)
        throw new Error('No ExtractionTargetsConfiguration found on EModelWorkflow');

      return extractionTargetsConfiguration['@id'];
    }),
  isEqual
);

const eModelExtractionTargetsConfigurationAtom = atomFamily<
  ModelResourceInfo,
  Atom<Promise<ExtractionTargetsConfiguration | null>>
>((resourceInfo) =>
  atom(async (get) => {
    const session = get(sessionAtom);
    const eModelExtractionTargetsConfigurationId = await get(
      eModelExtractionTargetsConfigurationIdAtom(resourceInfo)
    );

    if (!session || !eModelExtractionTargetsConfigurationId) return null;

    return fetchResourceById<ExtractionTargetsConfiguration>(
      eModelExtractionTargetsConfigurationId,
      session
    );
  })
);

export const experimentalTracesAtomFamily = atomFamily<
  ModelResourceInfo,
  Atom<Promise<ExperimentalTracesDataType[] | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const session = get(sessionAtom);
      const eModelExtractionTargetsConfiguration = await get(
        eModelExtractionTargetsConfigurationAtom(resourceInfo)
      );

      if (!eModelExtractionTargetsConfiguration || !session) return null;

      const traceIds = ensureArray(eModelExtractionTargetsConfiguration.uses).map(
        (trace) => trace['@id']
      );
      const tracesQuery = new esb.BoolQuery().filter([
        esb.boolQuery().must(esb.termQuery('deprecated', false)),
        esb.boolQuery().must(esb.termsQuery('@id', traceIds)),
      ]);

      const traces = await fetch(
        `${API_SEARCH}?addProject=${resourceInfo.virtualLabId}/${resourceInfo.projectId}`,
        {
          method: 'POST',
          headers: createHeaders(session.accessToken),
          body: JSON.stringify({ size: 1000, query: tracesQuery.toJSON() }),
        }
      )
        .then((res) => res.json())
        .then<ExperimentalTrace[]>((res) => res.hits.hits.map((hit: any) => hit._source));
      return traces.map((trace) => convertESTraceForUI(trace));
    }),
  isEqual
);
