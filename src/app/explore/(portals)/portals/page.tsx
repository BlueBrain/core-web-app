import { Portal } from '@/types/explore-portal';
import HomeHeader from '@/components/Global/HomeHeader';
import Item from '@/components/explore-section/Portals/Item';
import { PORTALS_LIST_CONTENT } from '@/constants/explore-section/portals-content';

export default function ExplorePortalsPage() {
  return (
    <div className="relative flex flex-row-reverse justify-start w-screen min-h-screen flex-nowrap bg-primary-9">
      <HomeHeader
        title="Portals"
        description="Here is a description of what can be achieved  in this app. What is expected from the user and what is the output..."
        link="/explore"
        buttonLabel="back to explore"
      />

      <div className="flex flex-col w-2/3 pr-8 gap-y-2 my-4">
        {PORTALS_LIST_CONTENT.map((singlePortal: Portal) => (
          <Item content={singlePortal} key={`single-portal_${singlePortal.name}`} />
        ))}
      </div>
    </div>
  );
}
