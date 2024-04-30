'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ModalStateProvider } from '@/components/VirtualLab/create/contexts/ModalStateContext';
import { CreateVirtualLabButton } from '@/components/VirtualLab/VirtualLabTopMenu/CreateVirtualLabButton';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  const extraHeaderItems: ReactNode[] = [<CreateVirtualLabButton key={1} />];

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
