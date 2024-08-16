'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import SideMenu from '@/components/SideMenu';
import { LinkItemKey, Label } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabProjectLayout({ children, params }: LabProjectLayoutProps) {
  const labUrl = generateLabUrl(params.virtualLabId);

  const labProjectUrl = `${labUrl}/project/${params.projectId}`;
  const scope = useAtomValue(selectedSimulationScopeAtom);
  const links: LinkItem[] = [
    {
      key: LinkItemKey.Simulate,
      href: `${labProjectUrl}/simulate`,
      content: 'Simulate',
      styles: 'rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
    },
  ];

  if (scope)
    links.unshift({
      key: 'scope',
      href: '#',
      content: <>{scope.replace('-', ' ')}</>,
      styles: 'text-primary-5 hover:!text-primary-5 cursor-default',
    });

  return (
    <div className="flex overflow-scroll bg-primary-9 pr-5 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="fixed left-0 top-0 flex h-screen w-1/4 flex-row gap-4">
          <SideMenu
            links={links}
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

          <VirtualLabProjectSidebar
            virtualLabId={params.virtualLabId}
            projectId={params.projectId}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex h-screen w-3/4 flex-col gap-10 overflow-y-auto">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
