import { useReducer, useRef } from 'react';

import ExploreMainMenu from './segments/ExploreMainMenu';
import BuildMainMenu from './segments/BuildMainMenu';
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
        'py-4 px-5 hover:bg-white text-left group flex-1 basis-1/3',
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
  const ref = useRef<HTMLDivElement>(null);
  const menuItem = MAIN_MENU_LIST.find((comp) => comp.id === id);

  useOnClickOutside(ref, onDeselect);

  if (!menuItem) return null;
  const { Component } = menuItem;
  return (
    <div
      className="relative overflow-y-auto pr-1 primary-scrollbar w-full mt-1 transition-all will-change-contents duration-300 ease-in-out"
      ref={ref}
    >
      <Component />
    </div>
  );
}

export default function MainMenu() {
  const [selectedSubmenuId, setSelectedSubmenu] = useReducer(
    (_: MainMenuListKey, value: MainMenuListKey) => value,
    null
  );

  const onSelect = (id: MainMenuListKey) => () => setSelectedSubmenu(id);

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
