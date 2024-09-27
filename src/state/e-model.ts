import isEqual from 'lodash/isEqual';
import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { fetchResourceById, fetchResourceByIdUsingResolver } from '@/api/nexus';
import { EModelConfiguration, EModelWorkflow, ExemplarMorphologyDataType } from '@/types/e-model'; // TODO: Confirm these types
import { EModelResource } from '@/types/explore-section/delta-model';

import { ReconstructedNeuronMorphology } from '@/types/explore-section/delta-experiment';
import sessionAtom from '@/state/session';
import { convertDeltaMorphologyForUI } from '@/services/e-model';

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

      const model = await fetchResourceById<EModelResource>(eModelId, session, {
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

      const eModelConfigurationPart = followedWorkflow.hasPart.find(
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
