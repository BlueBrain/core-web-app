import { atom } from 'jotai';

import { MEModel } from '@/types/me-model';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { SynaptomeConfigDistribution } from '@/types/synaptome';

type SimulationModel<T, S, K> = {
  base?: T | null;
  model?: S | null;
  configuration?: K | null;
};

export const simulationModelAtom = <T, S, K>() =>
  atom<SimulationModel<T, S, K>>({
    base: null,
    model: null,
    configuration: null,
  });

export const SynaptomeSimulationInstanceAtom = simulationModelAtom<
  MEModel,
  SynaptomeModelResource,
  SynaptomeConfigDistribution
>();
SynaptomeSimulationInstanceAtom.debugLabel = 'SynaptomeSimulationInstanceAtom';
