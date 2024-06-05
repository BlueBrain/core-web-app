import VirtualLabBanner from '../VirtualLabBanner';
import VirtualLabMainStatistics from '../VirtualLabMainStatistics';
import WelcomeUserBanner from './WelcomeUserBanner';
import BudgetPanel from './BudgetPanel';
import { getVirtualLabDetail } from '@/services/virtual-lab/labs';

export default async function VirtualLabDetail({ id }: { id?: string }) {
  const virtualLabDetail = id ? (await getVirtualLabDetail(id)).data.virtual_lab : undefined;
  return (
    <>
      <WelcomeUserBanner title={virtualLabDetail && virtualLabDetail.name} />
      <div className="mt-10">
        <VirtualLabBanner
          id={virtualLabDetail?.id}
          name={virtualLabDetail?.name}
          description={virtualLabDetail?.description}
          withEditButton
          bottomElements={
            <VirtualLabMainStatistics id={id} created_at={virtualLabDetail?.created_at} />
          }
        />
      </div>
      <BudgetPanel
        total={virtualLabDetail && virtualLabDetail.budget}
        totalSpent={300}
        remaining={350}
        suspended={!virtualLabDetail}
      />
    </>
  );
}
