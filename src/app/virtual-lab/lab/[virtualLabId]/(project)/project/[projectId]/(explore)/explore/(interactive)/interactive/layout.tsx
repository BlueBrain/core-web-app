'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSetAtom } from 'jotai';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import { defaultModelRelease } from '@/config';
import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import { Role, Label, Content, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';

export default function VirtualLabProjectInteractiveExploreLayout({
  children,
  params,
}: LabProjectLayoutProps) {
  const setConfigId = useSetAtom(brainModelConfigIdAtom);
  useSetBrainRegionFromQuery();

  // set Release 23.01 as the configuration of explore interactive
  useEffect(() => setConfigId(defaultModelRelease.id), [setConfigId]);

  const labUrl = `/virtual-lab/lab/${params.virtualLabId}`;
  const labProjectUrl = `${labUrl}/project/${params.projectId}`;

  return (
    <div className="grid h-screen grid-cols-[min-content_min-content_auto] grid-rows-1">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: LinkItemKey.Project,
                label: Label.Project,
                href: `${labProjectUrl}/home`,
                content: params.projectId,
              },
              {
                key: LinkItemKey.Explore,
                href: `${labProjectUrl}/explore`,
                content: Content.Explore,
                role: Role.Section,
                styles: 'rounded-full bg-primary-5 py-3 text-primary-9',
              },
            ]}
            lab={{
              key: LinkItemKey.VirtualLab,
              id: params.virtualLabId,
              label: Label.VirtualLab,
              href: `${labUrl}/lab`,
              content: params.virtualLabId,
            }}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
