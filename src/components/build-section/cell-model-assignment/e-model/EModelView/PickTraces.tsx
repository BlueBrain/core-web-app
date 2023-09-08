'use client';

import { Modal } from 'antd';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';

const TYPE = 'https://bbp.epfl.ch/ontologies/core/bmo/ExperimentalTrace';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
};

export default function PickTraces({ isOpen, onCancel, onOk }: Props) {
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
        <ExploreSectionListingView title="Experimental Traces" type={TYPE} enableDownload />
      </Modal>
    </div>
  );
}
