'use client';

import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';
import { SandboxBanner } from '@/components/VirtualLab/VirtualLabBanner';
import VirtualLabCTABanner from '@/components/VirtualLab/VirtualLabCTABanner';

export default function VirtualLabSandboxHomePage() {
  return (
    <div className="mt-5 flex flex-col gap-5">
      <SandboxBanner
        description="This is a space open to all interested in exploring the 3D atlas of the mouse brain at a scientific, biologically realistic, multiscale level. Here you can explore the datasets of single neurons, models, and in silico simulations prepared from experimental laboratories or developed over the past two decades by the Blue Brain Project and its collaborators. Whether you are an independent researcher or a neuroscience student without an institutional account, you can explore datasets and view models and simulations."
        name="Welcome to Blue Brain Open Platform"
      />
      <VirtualLabCTABanner
        title="Create your virtual lab"
        subtitle="In order to start your own projects, explore brain regions, build different models and simulate"
      />
      <DiscoverObpPanel />
    </div>
  );
}
