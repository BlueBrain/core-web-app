import { Atom, atom } from 'jotai';

import {
  configSourceAtom as cellCompositionConfigSourceAtom,
  cellCompositionAtom as cellCompositionBuildArtefact,
} from './cell-composition';

import {
  configSourceAtom as cellPositionConfigSourceAtom,
  partialCircuitAtom as cellPositionBuildArtefact,
} from './cell-position';

import {
  configSourceAtom as eModelAssignmentConfigSourceAtom,
  partialCircuitAtom as eModelAssignmentBuildArtefact,
} from './emodel-assignment';

import {
  configSourceAtom as morphologyAssignmentConfigSourceAtom,
  partialCircuitAtom as morphologyAssignmentBuildArtefact,
} from './cell-model-assignment/m-model';

import {
  configAtom as microConnectomeConfigSourceAtom, // source fixed
  partialCircuitAtom as microConnectomeBuildArtefact,
} from './micro-connectome';

import {
  configSourceAtom as macroConnectomeConfigSourceAtom,
  partialCircuitAtom as macroConnectomeBuildArtefact,
} from './macro-connectome';

import {
  configAtom as synapseConfigAtom,
  partialCircuitAtom as synapseBuildArtefact,
} from './synapse-editor';

import {
  configSourceAtom as modelConfigSourceAtom,
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
  configSourceAtom: Atom<Promise<GeneratorConfig | null>>;
  buildArtefactAtom: Atom<Promise<any>>;
};

const buildSteps: BuildStep[] = [
  {
    name: 'cellComposition',
    configSourceAtom: cellCompositionConfigSourceAtom,
    buildArtefactAtom: cellCompositionBuildArtefact,
  },
  {
    name: 'cellPosition',
    configSourceAtom: cellPositionConfigSourceAtom,
    buildArtefactAtom: cellPositionBuildArtefact,
  },
  {
    name: 'morphologyAssignment',
    configSourceAtom: morphologyAssignmentConfigSourceAtom,
    buildArtefactAtom: morphologyAssignmentBuildArtefact,
  },
  {
    name: 'eModelAssignment',
    configSourceAtom: eModelAssignmentConfigSourceAtom,
    buildArtefactAtom: eModelAssignmentBuildArtefact,
  },
  {
    name: 'macroConnectome',
    configSourceAtom: macroConnectomeConfigSourceAtom,
    buildArtefactAtom: macroConnectomeBuildArtefact,
  },
  {
    name: 'microConnectome',
    configSourceAtom: microConnectomeConfigSourceAtom,
    buildArtefactAtom: microConnectomeBuildArtefact,
  },
  {
    name: 'synapse',
    configSourceAtom: synapseConfigAtom,
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

    const modelConfig = await get(modelConfigSourceAtom);
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

        const configSource = await get(step.configSourceAtom);
        if (!configSource) {
          throw new Error(`Generator config source for ${step.name} can not be loaded`);
        }

        const configCloneMeta = await createResource(configSource, session);

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
