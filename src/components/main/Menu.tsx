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
  bgColor: string;
  selectedBgColor: string;
  selectedTextColor: string;
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
      'Examine neuronal models and virtual simulations through 3D interactive exploration and literature searches.',
    Component: ExploreMainMenu,
    bgColor: 'bg-primary-6',
    selectedBgColor: 'bg-black',
    selectedTextColor: 'text-white',
  },
  {
    id: 'main-build-entry',
    title: 'Build',
    description:
      'Build your own brain configurations by customizing cell compositions, neuronal models, and connectivity metrics.',
    Component: BuildMainMenu,
    bgColor: 'bg-primary-7',
    selectedBgColor: 'bg-white',
    selectedTextColor: 'text-primary-8',
  },
  {
    id: 'main-simulate-entry',
    title: 'Simulate',
    description: 'Run your own virtual experiments and simulations.',
    Component: SimulateMainMenu,
    bgColor: 'bg-primary-8',
    selectedBgColor: 'bg-white',
    selectedTextColor: 'text-primary-8',
  },
];

export function MainMenuSingleItem({
  id,
  title,
  description,
  bgColor,
  selected,
  onSelect,
  selectedBgColor,
  selectedTextColor,
}: MainMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect(id)}
      className={classNames(
        'py-4 px-5 h-full hover:bg-white text-left group flex-1 basis-1/3 flex flex-col items-start justify-stretch',
        selected ? selectedBgColor : bgColor
      )}
    >
      <h3
        className={classNames(
          'text-lg lg:text-2xl xl:text-3xl font-bold group-hover:text-primary-8',
          selected ? selectedTextColor : 'text-white'
        )}
      >
        {title}
      </h3>
      <p
        className={classNames(
          'line-clamp-2 text-sm font-normal group-hover:text-primary-8',
          selected ? selectedTextColor : 'text-white'
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
    <div className="relative overflow-y-auto primary-scrollbar w-full h-full transition-all will-change-contents duration-300 ease-in-out">
      <Component />
    </div>
  );
}

export default function MainMenu() {
  const params = useSearchParams();
  const tab = params?.get('tab');

  const [selectedSubmenuId, setSelectedSubmenu] = useReducer(
    (_: MainMenuListKey, value: MainMenuListKey) => value,
    'main-explore-entry'
  );

  const onSelect = (id: MainMenuListKey) => () => setSelectedSubmenu(id);

  useEffect(() => {
    let defaultSelectSubmenu: MainMenuListKey = null;
    if (tab === 'explore') defaultSelectSubmenu = 'main-explore-entry';
    if (tab === 'build') defaultSelectSubmenu = 'main-build-entry';
    if (tab === 'simulate') defaultSelectSubmenu = 'main-simulate-entry';
    if (tab) setSelectedSubmenu(defaultSelectSubmenu);
  }, [tab]);

  return (
    <div className="relative flex flex-col justify-start gap-px items-stretch w-full h-[calc(100vh-2.5rem)]">
      <div className="grid grid-cols-3 gap-x-1 col-start-2 col-span-3 bg-primary-8">
        {MAIN_MENU_LIST.map(
          ({ id, title, description, bgColor, selectedBgColor, selectedTextColor }) => (
            <MainMenuSingleItem
              key={id}
              {...{
                id,
                title,
                description,
                bgColor,
                onSelect,
                selected: selectedSubmenuId === id,
                selectedBgColor,
                selectedTextColor,
              }}
            />
          )
        )}
      </div>

      <RenderedMainDetails
        {...{
          id: selectedSubmenuId,
        }}
      />
    </div>
  );
}
