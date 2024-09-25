import isEqual from 'lodash/isEqual';
import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { fetchResourceById } from '@/api/nexus';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import { EModelConfiguration, EModelWorkflow } from '@/types/e-model'; // TODO: Confirm these types
import { EModelResource } from '@/types/explore-section/delta-model';
import { MEModelResource } from '@/types/me-model'; // TODO: Confirm this type

import sessionAtom from '@/state/session';

export type ModelResourceInfo = {
  modelId: string;
  modelType: ModelTypeNames;
  projectId: string;
  virtualLabId: string;
};

export const modelFamily = atomFamily<ModelResourceInfo, Atom<Promise<MEModelResource | null>>>(
  (resourceInfo) =>
    atom(async (get) => {
      const { modelId, projectId, virtualLabId } = resourceInfo;

      const session = get(sessionAtom);

      if (!session) return null;

      const model = await fetchResourceById<MEModelResource>(modelId, session, {
        org: virtualLabId,
        project: projectId,
      });

      return model;
    }),
  isEqual
);

export const eModelFromMEModelFamily = atomFamily<
  ModelResourceInfo,
  Atom<Promise<EModelResource | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const meModel = await get(modelFamily(resourceInfo));
      const session = get(sessionAtom);

      if (!meModel || !session) return null;

      const eModelPart = meModel.hasPart.find(({ '@type': type }) => type === 'EModel');
      const { '@id': eModelId } = eModelPart ?? {};

      if (!eModelId) return null;

      console.log("eModelId", eModelId)

      const { projectId, virtualLabId } = resourceInfo;

      const eModel = await fetchResourceById<EModelResource>(eModelId, session, {
        org: virtualLabId,
        project: projectId,
      });

      return eModel;
    }),
  isEqual
);

export const eModelWorkflowFamily = atomFamily<
  ModelResourceInfo,
  Atom<Promise<EModelWorkflow | null>>
>(
  (resourceInfo) =>
    atom(async (get) => {
      const eModel = await get(eModelFromMEModelFamily(resourceInfo));
      const session = get(sessionAtom);

      if (!eModel || !session) return null;

      const { projectId, virtualLabId } = resourceInfo;

      console.log(eModel)

      const { '@id': followedWorkflowId } = eModel.generation.activity.followedWorkflow;

      const followedWorkflow = await fetchResourceById<EModelWorkflow>(
        followedWorkflowId,
        session,
        {
          org: virtualLabId,
          project: projectId,
        }
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

      const { projectId, virtualLabId } = resourceInfo;

      const eModelConfiguration = await fetchResourceById<EModelConfiguration>(
        eModelConfigurationId,
        session,
        {
          org: virtualLabId,
          project: projectId,
        }
      );

      return eModelConfiguration;
    }),
  isEqual
);
