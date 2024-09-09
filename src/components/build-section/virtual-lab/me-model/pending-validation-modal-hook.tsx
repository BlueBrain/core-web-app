'use client';

import { useRef } from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import BluePyEModelContainer from './BluePyEModelContainer';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

export function usePendingValidationModal() {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();
  const onClose = () => destroyRef?.current?.();

  function createModal(virtualLabInfo: VirtualLabInfo) {
    const { destroy } = modal.confirm({
      title: null,
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 680,
      centered: true,
      mask: true,
      styles: {
        mask: { background: '#002766ba' },
        body: { padding: '60px 40px 20px' },
      },
      closeIcon: <CloseOutlined className="text-2xl text-primary-8" />,
      className: '![&>.ant-modal-content]:bg-red-500',
      content: <BluePyEModelContainer onClose={onClose} virtualLabInfo={virtualLabInfo} />,
    });
    destroyRef.current = destroy;
    return destroy;
  }

  return {
    createModal,
    contextHolder,
  };
}
