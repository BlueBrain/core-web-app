'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PlusOutlined } from '@ant-design/icons';

import { ModalStateProvider } from '@/components/VirtualLab/create/contexts/ModalStateContext';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  const { showModal } = useModalState();

  const extraHeaderItems: ReactNode[] = [
    <div
      key={1}
      className="flex w-52 flex-row justify-between border-r border-primary-7 p-4 font-bold"
      onClick={showModal}
    >
      <span className="font-bold">Create virtual lab</span>
      <PlusOutlined />
    </div>,
  ];

  return (
    <div className="bg-primary-9 p-10 text-white">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col text-2xl font-bold">
          <span>Open</span> <span> Brain</span> <span>Platform</span>
        </div>
        <ModalStateProvider>
          <VirtualLabTopMenu extraItems={extraHeaderItems} />
        </ModalStateProvider>
      </div>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
