import { Portal } from '@/types/explore-portal';
import HomeHeader from '@/components/Global/HomeHeader';
import Item from '@/components/explore-section/Portals/Item';
import { PORTALS_LIST_CONTENT } from '@/constants/explore-section/portals-content';

export default function ExplorePortalsPage() {
  return (
    <div className="relative flex min-h-screen w-screen flex-row-reverse flex-nowrap justify-start bg-primary-9">
      <HomeHeader
        title="Portals"
        description="Here is a description of what can be achieved  in this app. What is expected from the user and what is the output..."
        link="/explore"
        buttonLabel="back to explore"
      />

      <div className="my-4 flex w-2/3 flex-col gap-y-2 pr-8">
        {PORTALS_LIST_CONTENT.map((singlePortal: Portal) => (
          <Item content={singlePortal} key={`single-portal_${singlePortal.name}`} />
        ))}
      </div>
    </div>
  );
}
