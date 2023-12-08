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
    <div className={classNames('relative bg-primary-9 h-full')}>
      <div
        className="fixed bg-primary-9 bottom-0 w-full h-full min-h-screen z-0 bg-no-repeat bg-right-bottom [background-size:90%]"
        style={{
          backgroundImage: `url(${basePath}/images/obp_hippocampus.png)`,
        }}
      />
      <div className="absolute top-7 left-14 py-2">
        <OBPLogo color="text-white" />
      </div>
      <div className="fixed top-44 left-14 max-w-[250px] w-full z-10">
        <Link href="/" className="inline-flex items-center gap-1 group">
          <ArrowLeftOutlined className="text-white w-5 h-5 group-hover:text-primary-4" />
          <span className="text-white text-base font-bold group-hover:text-primary-4">
            Back to Home
          </span>
        </Link>
      </div>
      {isDocs && (
        <div className="absolute top-56 left-10 z-20 w-80 h-full">
          <DocumentationSideMenu />
        </div>
      )}
      <div className="absolute h-[calc(100vh-40px)] top-7 right-7 flex justify-end w-[calc(100%-3rem)] ml-auto overflow-hidden">
        <div className="relative flex flex-col justify-start items-stretch gap-1 w-3/4 h-full">
          <AboutMenu />
          <div className="overflow-y-auto primary-scrollbar overflow-x-hidden pr-1 h-full">
            <div className="bg-white h-full flex flex-col">
              <ErrorBoundary fallback={SimpleErrorComponent}>{children}</ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
