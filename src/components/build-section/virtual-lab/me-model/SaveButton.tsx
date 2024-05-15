'use client';

import { useSaveModal } from './save-modal-hook';
import GenericButton from '@/components/Global/GenericButton';

export default function SaveButton() {
  const { createModal, contextHolder } = useSaveModal();

  return (
    <>
      <GenericButton
        text="Save ME-Model"
        className="w-15 absolute bottom-5 right-5 mt-8 bg-secondary-3 text-white"
        onClick={createModal}
      />
      {contextHolder}
    </>
  );
}
