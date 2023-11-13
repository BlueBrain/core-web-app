import { useReducer } from 'react';

import ExploreMainMenu from './ExploreMainMenu';
import BuildMainMenu from './BuildMainMenu';
import SimulateMainMenu from './SimulateMainMenu';
import { classNames } from '@/util/utils';

type Empty = '';
type MainMenuListKey = Empty | 'main-explore-entry' | 'main-build-entry' | 'main-simulate-entry';
type TMainMenuItem = {
  id: MainMenuListKey;
  title: string;
  description: string;
  Component: (props: any) => JSX.Element;
  bgcolor: string;
};

type MainMenuItemProps = Omit<TMainMenuItem, 'Component'> & {
  selected: boolean;
  onSelect: (id: MainMenuListKey) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const MAIN_MENU_LIST: Array<TMainMenuItem> = [
  {
    id: 'main-explore-entry',
    title: 'Explore',
    description: 'Lorem irure in consequat sit consequat ipsum sint elit.',
    Component: ExploreMainMenu,
    bgcolor: 'bg-primary-6',
  },
  {
    id: 'main-build-entry',
    title: 'Build',
    description: 'Sint elit incididunt in excepteur culpa exercitation enim velit duis.',
    Component: BuildMainMenu,
    bgcolor: 'bg-primary-7',
  },
  {
    id: 'main-simulate-entry',
    title: 'Simulate',
    description:
      'Do officia esse ipsum nisi sit nisi sunt sunt occaecat esse labore elit ipsum eiusmod.',
    Component: SimulateMainMenu,
    bgcolor: 'bg-primary-8',
  },
];

function MainMenuItem({ id, title, description, bgcolor, selected, onSelect }: MainMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect(id)}
      className={classNames(
        'py-4 px-5 hover:bg-white text-left group flex-1 basis-1/3',
        bgcolor,
        selected && 'bg-white'
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

const renderedMainMenuDetails = (id: MainMenuListKey) => {
  const menuItem = MAIN_MENU_LIST.find((compo) => compo.id === id);

  if (menuItem) {
    const { Component } = menuItem;
    return <Component />;
  }
  return null;
};

export default function MainMenu() {
  const [selectedSubmenu, setSelectedSubmenu] = useReducer(
    (state: string, value: MainMenuListKey) => value,
    ''
  );
  const onSelect = (id: MainMenuListKey) => () => setSelectedSubmenu(id);

  return (
    <div className="flex flex-col justify-between gap-px items-stretch w-2/3">
      <div className="inline-flex items-stretch justify-between gap-x-1 gap-y-4">
        {MAIN_MENU_LIST.map(({ id, title, description, bgcolor }) => (
          <MainMenuItem
            key={id}
            {...{
              id,
              title,
              description,
              bgcolor,
              onSelect,
              selected: selectedSubmenu === id,
            }}
          />
        ))}
      </div>
      <div className="relative w-full mt-1 transition-all will-change-contents duration-300 ease-in-out">
        {renderedMainMenuDetails(selectedSubmenu)}
      </div>
    </div>
  );
}
