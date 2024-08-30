import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode, Suspense } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSidebar';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';

type Props = {
  children: ReactNode;
  params: {
    virtualLabId: string;
  };
};

export default async function VirtualLabLayout({ children, params }: Props) {
  return (
    <div className="flex h-screen overflow-y-auto bg-primary-9 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <SideMenu
          links={[]}
          lab={{
            key: LinkItemKey.VirtualLab,
            id: params.virtualLabId,
            label: Label.VirtualLab,
            href: `/virtual-lab/lab/${params.virtualLabId}/overview`,
          }}
        />
        <div className="flex h-screen w-full overflow-y-scroll bg-primary-9 p-8 text-white">
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <div className="m-w-3/12 flex flex-row gap-4" style={{ width: '25%' }}>
              <VirtualLabSidebar virtualLabId={params.virtualLabId} />
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
      </ErrorBoundary>
    </div>
  );
}
