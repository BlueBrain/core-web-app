'use client';

import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'next/navigation';

import ExploreMainMenu from './segments/ExploreMainMenu';
import BuildMainMenu from './segments/BuildMainMenu';
import SimulateMainMenu from './segments/SimulateMainMenu';
import { classNames } from '@/util/utils';

type MainMenuListKey = 'main-explore-entry' | 'main-build-entry' | 'main-simulate-entry' | null;
type MainMenuItem = {
  id: MainMenuListKey;
  title: string;
  description: string;
  Component: (props: any) => JSX.Element;
  bgcolor: string;
};

type MainMenuItemProps = Omit<MainMenuItem, 'Component'> & {
  selected: boolean;
  onSelect: (id: MainMenuListKey) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const MAIN_MENU_LIST: Array<MainMenuItem> = [
  {
    id: 'main-explore-entry',
    title: 'Explore',
    description:
      'Explore a large collection of neuronal models, virtual simulations, and brain cell distribution in a 3D and interactive manner',
    Component: ExploreMainMenu,
    bgcolor: 'bg-primary-6',
  },
  {
    id: 'main-build-entry',
    title: 'Build',
    description:
      'Build your own brain configurations by customizing the cell compositions, assigning neuronal models and configuring the desired connectivity pattern.',
    Component: BuildMainMenu,
    bgcolor: 'bg-primary-7',
  },
  {
    id: 'main-simulate-entry',
    title: 'Simulate',
    description: 'Run your own virtual experiments and simulations.',
    Component: SimulateMainMenu,
    bgcolor: 'bg-primary-8',
  },
];

export function MainMenuSingleItem({
  id,
  title,
  description,
  bgcolor,
  selected,
  onSelect,
}: MainMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect(id)}
      className={classNames(
        'py-4 px-5 hover:bg-white text-left group flex-1 basis-1/3 flex flex-col items-start',
        bgcolor,
        selected && 'bg-white shadow-lg'
      )}
    >
      <h3
        className={classNames(
          'text-lg font-bold group-hover:text-primary-8',
          selected ? 'text-primary-8' : 'text-white'
        )}
      >
        {title}
      </h3>
      <p
        className={classNames(
          'line-clamp-2 text-sm font-normal group-hover:text-primary-8',
          selected ? 'text-primary-8' : 'text-white'
        )}
      >
        {description}
      </p>
    </button>
  );
}

export function RenderedMainDetails({ id }: { id: MainMenuListKey }) {
  const menuItem = MAIN_MENU_LIST.find((comp) => comp.id === id);

  if (!menuItem) return null;

  const { Component } = menuItem;
  return (
    <div className="relative overflow-y-auto pr-1 primary-scrollbar w-full mt-1 transition-all will-change-contents duration-300 ease-in-out">
      <Component />
    </div>
  );
}

export default function MainMenu() {
  const params = useSearchParams();
  const tab = params?.get('tab');

  const [selectedSubmenuId, setSelectedSubmenu] = useReducer(
    (_: MainMenuListKey, value: MainMenuListKey) => value,
    null
  );

  const onSelect = (id: MainMenuListKey) => () => setSelectedSubmenu(id);

  useEffect(() => {
    // I use useEffect due the sidebar also exist in the main page
    // if not then using the searchparams immediatly in the reducer set fn
    // will do thing
    let defaultSelectSubmenu: MainMenuListKey = null;
    if (tab === 'explore') defaultSelectSubmenu = 'main-explore-entry';
    if (tab === 'build') defaultSelectSubmenu = 'main-build-entry';
    if (tab === 'simulate') defaultSelectSubmenu = 'main-simulate-entry';
    if (tab) setSelectedSubmenu(defaultSelectSubmenu);
  }, [tab]);

  return (
    <div className="relative flex flex-col justify-start gap-px items-stretch w-2/3">
      <div className="inline-flex items-stretch justify-between gap-x-1 gap-y-4 sticky top-0 z-20 bg-primary-8">
        {MAIN_MENU_LIST.map(({ id, title, description, bgcolor }) => (
          <MainMenuSingleItem
            key={id}
            {...{
              id,
              title,
              description,
              bgcolor,
              onSelect,
              selected: selectedSubmenuId === id,
            }}
          />
        ))}
      </div>

      <RenderedMainDetails
        {...{
          id: selectedSubmenuId,
        }}
      />
    </div>
  );
}