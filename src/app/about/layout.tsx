'use client';

import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@sentry/nextjs';
import { usePathname } from 'next/navigation';

import { classNames } from '@/util/utils';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import DocumentationSideMenu from '@/components/About/Documentation/SideMenu';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import AboutMenu from '@/components/About/Menu';
import { basePath } from '@/config';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith('/about/docs');

  return (
    <div className={classNames('relative h-full bg-primary-9')}>
      <div
        className="fixed bottom-0 z-0 h-full min-h-screen w-full bg-primary-9 bg-right-bottom bg-no-repeat [background-size:90%]"
        style={{
          backgroundImage: `url(${basePath}/images/obp_hippocampus.png)`,
        }}
      />
      <div className="absolute left-14 top-7 py-2">
        <OBPLogo color="text-white" />
      </div>
      <div className="fixed left-14 top-44 z-10 w-full max-w-[250px]">
        <Link href="/" className="group inline-flex items-center gap-1">
          <ArrowLeftOutlined className="h-5 w-5 text-white group-hover:text-primary-4" />
          <span className="text-base font-bold text-white group-hover:text-primary-4">
            Back to Home
          </span>
        </Link>
      </div>
      {isDocs && (
        <div className="absolute left-10 top-56 z-20 h-full w-80">
          <DocumentationSideMenu />
        </div>
      )}
      <div className="absolute right-7 top-7 ml-auto flex h-[calc(100vh-40px)] w-[calc(100%-3rem)] justify-end overflow-hidden">
        <div className="relative flex h-full w-3/4 flex-col items-stretch justify-start gap-1">
          <AboutMenu />
          <div className="primary-scrollbar h-full overflow-y-auto overflow-x-hidden pr-1">
            <div className="flex h-full flex-col bg-white">
              <ErrorBoundary fallback={SimpleErrorComponent}>{children}</ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
