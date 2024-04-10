'use client';

import { ErrorBoundary } from 'react-error-boundary';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import SideMenu from '@/components/SideMenu';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LayoutProps } from '@/types/virtual-lab/layout';
import { Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';


export default function VirtualLabProjectLayout({ children, params }: LayoutProps) {
  const labUrl = `/virtual-lab/lab/${params.virtualLabId}`;
  return (
    <div className="inset-0 z-0 mb-10 mr-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 bg-center bg-no-repeat pr-10 text-white bg-blend-lighten [background-size:70%]">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: LinkItemKey.VirtualLab,
                href: labUrl,
                label: Label.VirtualLab,
                content: (
                  <div className="flex gap-2 font-bold">
                    <span className="text-primary-3">Virtual lab:</span>Institute of Neuroscience
                  </div>
                ),
              },
            ]}
            lab={{
              key: LinkItemKey.VirtualLab,
              label: Label.VirtualLab,
              href: labUrl,
              content: params.virtualLabId,
            }}
          />

          <VirtualLabProjectSidebar virtualLabId={virtualLabId} projectId={projectId} />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="mt-10">
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
