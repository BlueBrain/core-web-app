import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { ConfigProvider, Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { selectedSimulationScopeAtom } from '@/state/simulate';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { SimulationType } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';
import hoverStyles from './hover-styles.module.css';

export enum SimulationScope {
  Cellular = 'cellular',
  Circuit = 'circuit',
  System = 'system',
}

type Item = {
  description: string;
  key: SimulationType;
  scope: `${SimulationScope}`;
  title: string;
};

type SlideProps = {
  className?: string;
  description: string;
  id: SimulationType;
  onChange: () => void;
  selectedSimulationScope: SimulationType;
  title: string;
};

export const items: Array<Item> = [
  {
    description: 'Coming soon.',
    key: SimulationType.IonChannel,
    scope: 'cellular',
    title: 'Ion Channel',
  },
  {
    description:
      'Load Hodgkin-Huxley single cell models, perform current clamp experiments with different levels of input current, and observe the resulting changes in membrane potential.',
    key: SimulationType.SingleNeuron,
    scope: 'cellular',
    title: 'Single Neuron',
  },
  {
    description:
      'Introduce spikes into the synapses of Hodgkin-Huxley cell models and carry out a virtual experiment by setting up a stimulation and reporting protocol.',
    key: SimulationType.Synaptome,
    scope: 'cellular',
    title: 'Synaptome',
  },
  {
    description:
      'Retrieve interconnected Hodgkin-Huxley cell models from a circuit and conduct a simulated experiment by establishing a stimulation and reporting protocol.',
    key: SimulationType.PairedNeuron,
    scope: 'circuit',
    title: 'Paired Neurons',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.Microcircuit,
    scope: 'circuit',
    title: 'Microcircuit',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.NeuroGliaVasculature,
    scope: 'circuit',
    title: 'Neuro-glia-vasculature',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.BrainRegions,
    scope: 'system',
    title: 'Brain Regions',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.BrainSystems,
    scope: 'system',
    title: 'Brain Systems',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.WholeBrain,
    scope: 'system',
    title: 'Whole Brain',
  },
];

function ScopeFilter({
  contentIsVisible,
  onClick,
  onChange,
  selectedScope,
}: {
  contentIsVisible: boolean;
  onChange: (scope: SimulationScope) => void;
  onClick: (scope: SimulationScope) => void;
  selectedScope: SimulationScope | null;
}) {
  const projectTopMenuRef = useAtomValue(projectTopMenuRefAtom);

  const controls = (
    <div className="flex flex-row !divide-x !divide-primary-3 border border-primary-3">
      {Object.entries(SimulationScope).map(([accessibleLabel, scope]) => {
        const isSelectedScope = scope === selectedScope;

        return (
          <label
            className={classNames(
              'flex cursor-pointer flex-row items-center gap-5 px-5 text-lg capitalize transition-all hover:bg-primary-8 hover:text-white',
              isSelectedScope && 'bg-white font-bold text-primary-9'
            )}
            key={scope}
            htmlFor={`scope-filter-${scope}`}
          >
            <input
              aria-label={accessibleLabel}
              checked={isSelectedScope}
              className="sr-only"
              id={`scope-filter-${scope}`}
              onChange={() => onChange(scope)}
              onClick={() => onClick(scope)}
              type="radio"
            />
            {isSelectedScope ? (
              <>
                <span>{scope}</span>
                {contentIsVisible && (
                  <DownOutlined
                    style={{
                      fontSize: 12,
                    }}
                    size={4}
                  />
                )}
              </>
            ) : (
              scope
            )}
          </label>
        );
      })}
    </div>
  );

  return projectTopMenuRef?.current && createPortal(controls, projectTopMenuRef.current);
}

function ScopeOption(props: SlideProps) {
  const { className, description, id: key, onChange, selectedSimulationScope, title } = props;

  const currentScopeIsSelected = selectedSimulationScope === key; // This particular scope is selected.

  const anyScopeIsSelected = !!selectedSimulationScope;
  const anotherScopeIsSelected = anyScopeIsSelected && !currentScopeIsSelected; // A scope is selected, but it isn't this one.

  return (
    <label
      className={classNames(
        'flex w-96 cursor-pointer flex-col text-left text-white',
        currentScopeIsSelected && hoverStyles.isSelected,
        anotherScopeIsSelected && hoverStyles.isNotSelected,
        className
      )}
      htmlFor={`scope-${key}`}
    >
      <input
        aria-describedby={`scope-${key}-description`}
        aria-label={title}
        checked={currentScopeIsSelected}
        className="sr-only"
        id={`scope-${key}`}
        onChange={onChange}
        type="radio"
      />
      <h2 className="text-3xl">{title}</h2>
      <span className="font-light" id={`scope-${key}-description`}>
        {description}
      </span>
    </label>
  );
}

export default function ScopeSelector() {
  const [selectedScope, setSelectedScope] = useState<SimulationScope>(SimulationScope.Cellular);

  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  const [contentIsVisible, setContentVisibility] = useState<boolean>(false);

  const availableScopes = items
    .filter(({ scope }) => !selectedScope || scope === selectedScope)
    .map(({ description, key, title }) => (
      <ScopeOption
        className={hoverStyles.customSlide}
        description={description}
        id={key}
        key={key}
        onChange={() => {
          setSelectedSimulationScope(key);
          setContentVisibility(false);
        }}
        selectedSimulationScope={selectedSimulationScope}
        title={title}
      />
    ));

  return (
    <>
      <ScopeFilter
        contentIsVisible={contentIsVisible}
        onChange={(scope: SimulationScope) => setSelectedScope(scope)}
        onClick={(scope: SimulationScope) =>
          scope === selectedScope || !contentIsVisible
            ? setContentVisibility((isVisible) => !isVisible)
            : {}
        }
        selectedScope={selectedScope}
      />
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentPadding: 0,
              headerPadding: 0,
            },
          },
        }}
      >
        <Collapse
          activeKey={contentIsVisible ? 1 : undefined}
          bordered={false}
          expandIcon={() => false}
          items={[
            {
              key: '1',
              label: '',
              children: <div className="my-6 flex gap-8 bg-primary-9">{availableScopes}</div>,
            },
          ]}
        />
      </ConfigProvider>
    </>
  );
}
