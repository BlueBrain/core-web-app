'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SideMenu from '@/components/SideMenu';
import { LinkItemKey, Content, Role, Label } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

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

  return (
    <div className="grid h-screen grid-cols-[max-content_auto] grid-rows-1 bg-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <SideMenu
          links={[
            {
              key: LinkItemKey.Simulate,
              href: `${labProjectUrl}/simulate`,
              content: Content.Simulate,
              role: Role.Section,
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
      </ErrorBoundary>
      {children}
    </div>
  );
}
