'use client';

import BackToInteractiveExplorationBtn from '@/components/explore-section/BackToInteractiveExplorationBtn';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

export default function ArticleListForExperimentLayout({
  children,
  params,
}: LabProjectLayoutProps) {
  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  return (
    <div className="flex h-screen overflow-y-hidden bg-white">
      <BackToInteractiveExplorationBtn
        prefetch={false}
        href={`${vlProjectUrl}/explore/interactive`}
      />
      {children}
    </div>
  );
}
