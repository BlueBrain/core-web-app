import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { classNames } from '@/util/utils';

export type SubMenuList<TKeys> = {
  id: TKeys;
  title: string;
  description: string;
  Component: ({ opened }: { opened?: boolean }) => JSX.Element;
  Header?: ({ opened }: { opened?: boolean }) => JSX.Element;
};

export type CollapsibleMenuProps = {
  opened: boolean;
  title: string;
  description: string;
};

export function MainMenuItemHeader({ title, description, opened }: CollapsibleMenuProps) {
  return (
    <div className="relative inline-flex w-full flex-col items-start justify-start">
      <h2
        className={classNames(
          'text-xl font-bold text-primary-8',
          !opened && 'group-hover:text-white'
        )}
      >
        {title}
      </h2>
      <p
        className={classNames(
          'line-clamp-2 w-1/3 text-left font-normal text-gray-400',
          !opened && 'group-hover:text-white'
        )}
      >
        {description}
      </p>
      {opened ? (
        <MinusOutlined
          className={classNames(
            'absolute right-7 top-1/2 -translate-y-1/2 text-primary-8',
            !opened && 'group-hover:text-white'
          )}
        />
      ) : (
        <PlusOutlined
          className={classNames(
            'absolute right-7 top-1/2 -translate-y-1/2 text-primary-8',
            !opened && 'group-hover:text-white'
          )}
        />
      )}
    </div>
  );
}

export function CollapsibleMenuItem<T>({
  id,
  opened,
  title,
  description,
  onSelect,
  Header = MainMenuItemHeader,
  children,
}: {
  id: T;
  opened: boolean;
  title: string;
  description: string;
  onSelect: (id: T | null) => void;
  Header?: (props: CollapsibleMenuProps) => JSX.Element;
  children: ({ opened }: { opened: boolean }) => React.ReactNode;
}) {
  const onSelectCollapsible = () => onSelect(opened ? null : id);

  return (
    <div className={classNames('group bg-white', opened ? 'shadow-lg' : 'hover:bg-primary-8')}>
      <button
        type="button"
        onClick={onSelectCollapsible}
        className={classNames('w-full cursor-pointer p-7', opened && 'z-20 bg-white')}
      >
        <Header {...{ opened, title, description }} />
      </button>
      <div
        className={classNames('h-full py-7 pt-3 transition-all duration-200', !opened && 'hidden')}
      >
        {children({ opened })}
      </div>
    </div>
  );
}
