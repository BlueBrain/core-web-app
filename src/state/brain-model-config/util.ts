import { Atom, atom } from 'jotai';

import {
  configAtom as cellCompositionConfigAtom,
  cellCompositionAtom as cellCompositionBuildArtefact,
} from './cell-composition';

import {
  configAtom as cellPositionConfigAtom,
  partialCircuitAtom as cellPositionBuildArtefact,
} from './cell-position';

import {
  configAtom as eModelAssignmentConfigAtom,
  partialCircuitAtom as eModelAssignmentBuildArtefact,
} from './emodel-assignment';

import {
  configAtom as morphologyAssignmentConfigAtom,
  partialCircuitAtom as morphologyAssignmentBuildArtefact,
} from './cell-model-assignment/m-model';

import {
  configAtom as microConnectomeConfigAtom, // source fixed
  partialCircuitAtom as microConnectomeBuildArtefact,
} from './micro-connectome';

import {
  configAtom as macroConnectomeConfigAtom,
  partialCircuitAtom as macroConnectomeBuildArtefact,
} from './macro-connectome';

import {
  configAtom as synapseConfigAtom,
  partialCircuitAtom as synapseBuildArtefact,
} from './synapse-editor';

import {
  configAtom as modelConfigAtom,
  configAtom as modelConfigMetaAtom,
  triggerRefetchAtom,
} from '.';
import sessionAtom from '@/state/session';

import { createResource, updateResource } from '@/api/nexus';
import { GeneratorConfig } from '@/types/nexus';

type BuildStepName =
  | 'cellComposition'
  | 'cellPosition'
  | 'morphologyAssignment'
  | 'eModelAssignment'
  | 'microConnectome'
  | 'macroConnectome'
  | 'synapse';

type BuildStep = {
  name: BuildStepName;
  configAtom: Atom<Promise<GeneratorConfig | null>>;
  buildArtefactAtom: Atom<Promise<any>>;
};

const buildSteps: BuildStep[] = [
  {
    name: 'cellComposition',
    configAtom: cellCompositionConfigAtom,
    buildArtefactAtom: cellCompositionBuildArtefact,
  },
  {
    name: 'cellPosition',
    configAtom: cellPositionConfigAtom,
    buildArtefactAtom: cellPositionBuildArtefact,
  },
  {
    name: 'morphologyAssignment',
    configAtom: morphologyAssignmentConfigAtom,
    buildArtefactAtom: morphologyAssignmentBuildArtefact,
  },
  {
    name: 'eModelAssignment',
    configAtom: eModelAssignmentConfigAtom,
    buildArtefactAtom: eModelAssignmentBuildArtefact,
  },
  {
    name: 'macroConnectome',
    configAtom: macroConnectomeConfigAtom,
    buildArtefactAtom: macroConnectomeBuildArtefact,
  },
  {
    name: 'microConnectome',
    configAtom: microConnectomeConfigAtom,
    buildArtefactAtom: microConnectomeBuildArtefact,
  },
  {
    name: 'synapse',
    configAtom: synapseConfigAtom,
    buildArtefactAtom: synapseBuildArtefact,
  },
];

const invalidateConfigAtom = atom<null, [BuildStepName], Promise<void>>(
  null,
  async (get, set, buildStepName) => {
    const session = get(sessionAtom);
    if (!session) {
      throw new Error('No session');
    }

    const modelConfig = await get(modelConfigAtom);
    if (!modelConfig) {
      throw new Error('No model config');
    }

    const stepsToInvalidate = buildSteps.slice(
      buildSteps.findIndex((step) => step.name === buildStepName)
    );

    let modelConfigHasUpdates = false;

    await Promise.all(
      stepsToInvalidate.map(async (step) => {
        const buildArtefact = await get(step.buildArtefactAtom);

        if (!buildArtefact) return;

        const config = await get(step.configAtom);
        if (!config) {
          throw new Error(`Generator config source for ${step.name} can not be loaded`);
        }

        const configCloneMeta = await createResource(config, session);

        modelConfig.configs[`${step.name}Config`]['@id'] = configCloneMeta['@id'];
        modelConfigHasUpdates = true;
      })
    );

    if (!modelConfigHasUpdates) return;

    const modelConfigMeta = await get(modelConfigMetaAtom);
    if (!modelConfigMeta) {
      throw new Error('Model config meta can not be loaded');
    }

    await updateResource(modelConfig, session);

    set(triggerRefetchAtom);
  }
);

export default invalidateConfigAtom;
