'use client';

import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue, useSetAtom } from 'jotai';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Link from '@/components/Link';
import { meModelSectionAtom, morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';
import { MEModelMorphologyType } from '@/types/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function BuildMEModelMorphologyLayout({ children }: GenericLayoutProps) {
  const setMEModelSection = useSetAtom(meModelSectionAtom);

  useEffect(() => setMEModelSection('morphology'), [setMEModelSection]);

  return (
    <>
      <div className="flex px-10 py-5">
        {morphologyTabs.map((tab) => (
          <Item key={tab.link} tab={tab} />
        ))}
      </div>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex-grow px-10">{children}</div>
      </ErrorBoundary>
    </>
  );
}

type MorphologyTab = {
  link: string;
  name: string;
  morphType: MEModelMorphologyType;
  disabled?: boolean;
};

const morphologyTabs: MorphologyTab[] = [
  {
    link: '/build/me-model/morphology/reconstructed',
    name: 'Reconstructed Morphology',
    morphType: 'reconstructed',
  },
  {
    link: '/build/me-model/morphology/synthetised',
    name: 'Synthetised Morphology',
    morphType: 'synthetised',
    disabled: true,
  },
];

function Item({ tab }: { tab: MorphologyTab }) {
  const morphologyType = useAtomValue(morphologyTypeAtom);

  const isSelected = morphologyType === tab.morphType;

  const style = classNames(
    isSelected ? 'bg-primary-8 text-white' : 'text-primary-8 bg-white',
    'px-7 py-2 border',
    tab.disabled ? 'text-slate-500 pointer-events-none bg-slate-100' : 'cursor-pointer'
  );

  return (
    <Link className={style} href={tab.link}>
      {tab.name}
    </Link>
  );
}
