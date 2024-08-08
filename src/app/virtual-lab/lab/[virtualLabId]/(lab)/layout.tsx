import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
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
        {children}
      </ErrorBoundary>
    </div>
  );
}
