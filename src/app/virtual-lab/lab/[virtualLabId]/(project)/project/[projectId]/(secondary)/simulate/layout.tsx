'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useAtomValue } from 'jotai';
import SideMenu from '@/components/SideMenu';
import { LinkItemKey, Content, Label } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { selectedSimulationScopeAtom } from '@/state/simulate';

type Props = {
  children: ReactNode;
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

export default function SimulateSingleNeuronEditLayout({ children, params }: Props) {
  const labUrl = generateLabUrl(params.virtualLabId);

  const labProjectUrl = `${labUrl}/project/${params.projectId}`;
  const scope = useAtomValue(selectedSimulationScopeAtom);

  return (
    <div className="grid h-screen grid-cols-[max-content_auto] grid-rows-1 bg-white">
      <SideMenu
        links={[
          {
            key: 'scope',
            href: '#',
            content: <>{scope.replace('-', ' ')}</>,
            styles: 'text-primary-5 hover:!text-primary-5 cursor-default',
          },
          {
            key: LinkItemKey.Simulate,
            href: `${labProjectUrl}/simulate`,
            content: Content.Simulate,
            styles: 'rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
          },
        ]}
        lab={{
          key: LinkItemKey.VirtualLab,
          id: params.virtualLabId,
          label: Label.VirtualLab,
          href: `${labUrl}/overview`,
        }}
        project={{
          key: LinkItemKey.Project,
          id: params.projectId,
          virtualLabId: params.virtualLabId,
          label: Label.Project,
          href: `${labProjectUrl}/home`,
        }}
      />
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
