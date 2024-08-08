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
import { generateLabUrl } from '@/util/virtual-lab/urls';

export default function VirtualLabProjectInteractiveExploreLayout({
  children,
  params,
}: LabProjectLayoutProps) {
  const setConfigId = useSetAtom(brainModelConfigIdAtom);
  useSetBrainRegionFromQuery();

  // set Release as the configuration of explore interactive
  useEffect(() => setConfigId(defaultModelRelease.id), [setConfigId]);

  const labUrl = generateLabUrl(params.virtualLabId);
  const labProjectUrl = `${labUrl}/project/${params.projectId}`;

  return (
    <div className="grid h-screen grid-cols-[min-content_min-content_auto] grid-rows-1">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: LinkItemKey.Explore,
                href: `${labProjectUrl}/explore/interactive`,
                content: Content.Explore,
                role: Role.Section,
                styles: 'rounded-full bg-primary-5 py-3 text-primary-9',
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
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
