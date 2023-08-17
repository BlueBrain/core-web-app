import HomeHeader from '@/components/Global/HomeHeader';
import SinglePortalItem from '@/components/explore-section/Portals/SinglePortalItem';
import { portalsContent, Portals } from '@/constants/explore-section/portals-content';

export default function ExplorePortalsPage() {
  return (
    <div className="relative flex flex-row-reverse justify-start w-screen min-h-screen flex-nowrap bg-primary-9">
      <HomeHeader
        title="Portals"
        description="Here is a description of what can be achieved  in this app. What is expected from the user and what is the output..."
      />

      <div className="flex flex-col w-2/3 pr-8 gap-y-2 my-4">
        {portalsContent.map((singlePortal: Portals) => (
          <SinglePortalItem content={singlePortal} key={`single-portal_${singlePortal.name}`} />
        ))}
      </div>
    </div>
  );
}
