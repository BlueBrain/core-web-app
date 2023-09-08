'use client';

import { Modal } from 'antd';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
};

export default function PickMorphology({ isOpen, onCancel, onOk }: Props) {
  const width = typeof window !== 'undefined' ? window.innerWidth - 50 : undefined;

  return (
    <div>
      <Modal
        open={isOpen}
        title={null}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        centered
        width={width}
      >
        <ExploreSectionListingView
          title="Neuron morphology"
          type={NEURON_MORPHOLOGY}
          enableDownload
        />
      </Modal>
    </div>
  );
}
