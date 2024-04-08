import { VirtualLabPlanType } from '@/services/virtual-lab/types';
import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';

const virtualLab = {
  id: 'arst',
  name: 'Mock Virtual Lab',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor enim nec condimentum varius. Suspendisse quis sem efficitur, lacinia enim eu, facilisis leo. Aliquam ex arcu, aliquet et sagittis ac, imperdiet a diam. Fusce sodales, sapien ut mollis faucibus, nisi ex fringilla tellus, eu sagittis ipsum neque eu justo. Suspendisse potenti. Mauris a pellentesque arcu. Ut accumsan viverra nibh, vel condimentum ipsum semper quis. In venenatis vel nulla ut tempor. Mauris libero mi, mattis eget iaculis ac, vulputate id augue. Sed ullamcorper, erat ut euismod congue, lorem diam volutpat lectus, id tempus mi diam nec est. Aenean eu libero a.',
  referenceEMail: 'harry.anderson@epfl.ch',
  members: [],
  plan: VirtualLabPlanType.intermediate,
  billing: {
    organization: 'EPFL',
    firstname: 'Harry',
    lastname: 'Anderson',
    address: 'Chem. des Mines 9',
    city: 'Geneva',
    postalCode: '1202',
    country: 'CH',
  },
};

export default function VirtualLabAdminPage() {
  return <VirtualLabSettingsComponent virtualLab={virtualLab} user={{ username: 'handerso' }} />;
}
