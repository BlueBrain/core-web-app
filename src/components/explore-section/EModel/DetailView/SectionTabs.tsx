import { parseAsString, useQueryState } from 'nuqs';
import { classNames } from '@/util/utils';

export type EmodelTabKeys = 'configuration' | 'analysis' | 'simulation';
export const EMODEL_TABS: Array<{ key: EmodelTabKeys; title: string }> = [
  {
    key: 'configuration',
    title: 'Configuration',
  },
  {
    key: 'analysis',
    title: 'Analysis',
  },
  {
    key: 'simulation',
    title: 'Simulation',
  },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsString.withDefault(EMODEL_TABS.at(0)!.key)
  );

  const onClick = (key: string) => () => setActiveTab(key);

  return (
    <ul className="flex w-full items-center justify-center">
      {EMODEL_TABS.map(({ key, title }) => (
        <li
          title={title}
          key={key}
          className={classNames(
            'w-1/3 flex-[1_1_33%] border py-3 text-center text-xl font-semibold transition-all duration-200 ease-out',
            activeTab === key ? 'bg-primary-9 text-white' : 'bg-white text-primary-9'
          )}
        >
          <button type="button" className="w-full" onClick={onClick(key)} onKeyDown={onClick(key)}>
            {title}
          </button>
        </li>
      ))}
    </ul>
  );
}
