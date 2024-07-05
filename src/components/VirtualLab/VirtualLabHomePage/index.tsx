import { LabDetailBanner } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import { getVirtualLabDetail } from '@/services/virtual-lab/labs';

export default async function VirtualLabHome({ id }: { id: string }) {
  const vlab = (await getVirtualLabDetail(id)).data.virtual_lab;
  return (
    <>
      <WelcomeUserBanner title={vlab.name} />
      <div className="mt-10">
        <LabDetailBanner initialVlab={vlab} />
      </div>
    </>
  );
}
