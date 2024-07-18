import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingOutlined } from '@ant-design/icons';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import VirtualLabSidebarWithTitle from '@/components/VirtualLab/VirtualLabSidebar';
import { VirtualLabSidebarSkeleton } from '@/components/VirtualLab/VirtualLabSidebar/VirtualLabSidebarSkeleton';

export default function VirtualLabPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { virtualLabId: string };
}) {
  return (
    <div className="flex h-screen w-full overflow-y-scroll bg-primary-9 p-8 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="m-w-3/12 flex flex-row gap-4" style={{ width: '25%' }}>
          <Suspense fallback={<VirtualLabSidebarSkeleton />}>
            <VirtualLabSidebarWithTitle virtualLabId={params.virtualLabId} />
          </Suspense>
        </div>

        <div className="m-w-9/12 ml-3" style={{ width: '75%' }}>
          <VirtualLabTopMenu />

          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <LoadingOutlined />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}
