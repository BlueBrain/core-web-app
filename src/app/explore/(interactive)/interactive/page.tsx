import ThreeDeeView from '@/components/build-section/ThreeDeeView';
import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';

export default function InteractivePage() {
  return (
    <div className="relative">
      <ThreeDeeView />
      <SelectedBrainRegionPanel />
    </div>
  );
}
