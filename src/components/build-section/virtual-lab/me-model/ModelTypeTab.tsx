import { useAtomValue } from 'jotai';

import Link from '@/components/Link';
import { meModelSectionAtom } from '@/state/virtual-lab/build/me-model';
import { MEModelSection } from '@/types/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';

export default function ModelTypeTab() {
  return (
    <div className="grid grid-cols-2">
      {tabs.map((tab) => (
        <Item key={tab.link} tab={tab} />
      ))}
    </div>
  );
}

type TabInfo = {
  link: string;
  name: string;
  sectionName: MEModelSection;
  description?: string;
};

const tabs: TabInfo[] = [
  {
    link: '/build/me-model/build/morphology/reconstructed',
    name: 'Morphology',
    sectionName: 'morphology',
    description: 'Select a morphology to use for the single neuron model.',
  },
  {
    link: '/build/me-model/build/electrophysiology',
    name: 'Electrophysiology',
    sectionName: 'electrophysiology',
    description: 'Select an electrical model to use for the single neuron model.',
  },
];

type ItemProps = {
  tab: TabInfo;
};

function Item({ tab }: ItemProps) {
  const meModelSection = useAtomValue(meModelSectionAtom);

  const isSelected = meModelSection === tab.sectionName;

  const style = classNames(
    isSelected ? 'text-primary-8 bg-white' : 'bg-primary-8 text-slate-300',
    'p-5 inline-block'
  );

  return (
    <Link href={tab.link} className={style}>
      <div className="text-2xl font-bold">{tab.name}</div>
      <div className="font-thin">{tab.description}</div>
    </Link>
  );
}
