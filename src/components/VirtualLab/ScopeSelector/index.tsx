import { Dispatch, useState, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';

import { basePath } from '@/config';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { SimulationType } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';
import hoverStyles from './hover-styles.module.css';

enum SimulationScope {
  Cellular = 'cellular',
  Circuit = 'circuit',
  System = 'system',
}

type SlideProps = {
  className?: string;
  description: string;
  id: SimulationType;
  selectedSimulationScope: SimulationType | null;
  setSelectedSimulationScope: Dispatch<SetStateAction<SimulationType | null>>;
  src: string;
  title: string;
};

const imgBasePath = `${basePath}/images/virtual-lab/simulate`;

export const items = [
  {
    description: 'Coming soon.',
    key: SimulationType.IonChannel,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.IonChannel}.png`,
    title: 'Ion Channel',
  },
  {
    description:
      'Load Hodgkin-Huxley single cell models, perform current clamp experiments with different levels of input current, and observe the resulting changes in membrane potential.',
    key: SimulationType.SingleNeuron,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.SingleNeuron}.png`,
    title: 'Single Neuron',
  },
  {
    description:
      'Introduce spikes into the synapses of Hodgkin-Huxley cell models and carry out a virtual experiment by setting up a stimulation and reporting protocol.',
    key: SimulationType.Synaptome,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.Synaptome}.png`,
    title: 'Synaptome',
  },
  {
    description:
      'Retrieve interconnected Hodgkin-Huxley cell models from a circuit and conduct a simulated experiment by establishing a stimulation and reporting protocol.',
    key: SimulationType.PairedNeuron,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.PairedNeuron}.png`,
    title: 'Paired Neurons',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.Microcircuit,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.Microcircuit}.png`,
    title: 'Microcircuit',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.NeuroGliaVasculature,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.NeuroGliaVasculature}.png`,
    title: 'Neuro-glia-vasculature',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.BrainRegions,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.BrainRegions}.png`,
    title: 'Brain Regions',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.BrainSystems,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.BrainSystems}.png`,
    title: 'Brain Systems',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.WholeBrain,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.WholeBrain}.png`,
    title: 'Whole Brain',
  },
];

function ScopeFilter({
  selectedScope,
  setSelectedScope,
}: {
  selectedScope: SimulationScope | null;
  setSelectedScope: Dispatch<SetStateAction<SimulationScope | null>>;
}) {
  const projectTopMenuRef = useAtomValue(projectTopMenuRefAtom);

  const controls = (
    <div className="flex flex-row !divide-x !divide-[#69C0FF] border border-[#69C0FF]">
      {(Object.values(SimulationScope) as Array<SimulationScope>).map((scope) => (
        <button
          className={classNames(
            'px-5 text-lg capitalize hover:bg-primary-8 hover:text-white',
            selectedScope === scope && 'bg-white font-bold text-primary-9'
          )}
          data-testid={`scope-filter-${scope}`}
          key={scope}
          onClick={() => setSelectedScope(scope)}
          type="button"
        >
          {scope}
        </button>
      ))}
    </div>
  );

  return projectTopMenuRef?.current && createPortal(controls, projectTopMenuRef.current);
}

function CustomSlide(props: SlideProps) {
  const {
    className,
    description,
    id: key,
    selectedSimulationScope,
    setSelectedSimulationScope,
    src,
    title,
    ...otherProps // These come from AntD's Carousel component. Do not remove.
  } = props;

  const currentScopeIsSelected = selectedSimulationScope === key; // This particular scope is selected.

  const anyScopeIsSelected = !!selectedSimulationScope;
  const anotherScopeIsSelected = anyScopeIsSelected && !currentScopeIsSelected; // A scope is selected, but it isn't this one.

  return (
    <button
      className={classNames(
        'flex w-96 flex-col text-left text-white',
        currentScopeIsSelected && hoverStyles.isSelected,
        anotherScopeIsSelected && hoverStyles.isNotSelected,
        className
      )}
      disabled={currentScopeIsSelected}
      onClick={() => setSelectedSimulationScope(selectedSimulationScope !== key ? key : null)}
      type="button"
      data-testid={`scope-item-${key}`}
      {...otherProps} // eslint-disable-line react/jsx-props-no-spreading
    >
      <h2 className="text-3xl">{title}</h2>
      <span className="font-light">{description}</span>
    </button>
  );
}

export default function ScopeSelector() {
  const [selectedScope, setSelectedScope] = useState<SimulationScope | null>(
    SimulationScope.Cellular
  );

  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  const availableScopes = items
    .filter(({ scope }) => !selectedScope || scope === selectedScope)
    .map(({ description, key, src, title }) => (
      <CustomSlide
        className={hoverStyles.customSlide}
        description={description}
        id={key}
        key={key}
        selectedSimulationScope={selectedSimulationScope}
        setSelectedSimulationScope={setSelectedSimulationScope}
        src={src}
        title={title}
      />
    ));

  return (
    <>
      <ScopeFilter selectedScope={selectedScope} setSelectedScope={setSelectedScope} />
      <div className="flex gap-8">{availableScopes}</div>
    </>
  );
}
