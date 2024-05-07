import VirtualLabBanner from '@/components/VirtualLab/VirtualLabBanner';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';
import VirtualLabCTABanner from '@/components/VirtualLab/VirtualLabCTABanner';

export default function VirtualLabSandboxHomePage() {
  return (
    <div className="mt-5 flex flex-col gap-5">
      <VirtualLabBanner
        key="sandbox"
        id="sandbox"
        name="Welcome to Open Brain Platform"
        description="Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean lacinia bibendum nulla sed consectetur. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum."
      />
      <VirtualLabCTABanner />
      <DiscoverObpPanel />
    </div>
  );
}
