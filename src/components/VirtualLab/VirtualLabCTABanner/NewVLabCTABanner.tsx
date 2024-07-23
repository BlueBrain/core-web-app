'use client';

import CreateVirtualLabModal from '../CreateVirtualLabButton/CreateVirtualLabModal';
import VirtualLabCTABanner from '.';
import { useAtom } from '@/state/state';

type Props = {
  title: string;
  subtitle: string;
};

export default function NewVLabCTABanner({ title, subtitle }: Props) {
  const [, setIsModalVisible] = useAtom<boolean>('new-vlab-modal-open');

  return (
    <>
      <VirtualLabCTABanner
        title={title}
        subtitle={subtitle}
        onClick={() => setIsModalVisible(true)}
      />
      <CreateVirtualLabModal />
    </>
  );
}
