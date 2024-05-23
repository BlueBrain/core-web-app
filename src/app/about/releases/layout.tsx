import fs from 'fs/promises';
import path from 'path';
import { Suspense } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { Release, ReleaseCard } from '@/components/About/Release/List';

async function getAllReleases(): Promise<Array<Release>> {
  const file = await fs.readFile(path.resolve(`./public/mock-data/releases.json`), 'utf8');
  return JSON.parse(file);
}

async function ReleasesList() {
  const releases = await getAllReleases();
  return (
    <>
      <div className="pb-5 pl-12 pt-9">
        <h1 className="pr-4 text-4xl font-bold text-primary-8">What has happened in BBOP?</h1>
        <div />
      </div>
      <div className="bg-white py-4 pl-12 pr-4">
        <div
          className="no-scrollbar grid w-full snap-x snap-mandatory gap-3 overflow-x-scroll overscroll-x-contain"
          style={{
            gridTemplateColumns: `repeat(${releases.length}, 20vw)`,
          }}
        >
          {releases.map(({ id, title, description, image: src, width, height, date, version }) => (
            <ReleaseCard
              key={`release-${id}`}
              {...{ id, title, description, image: src, width, height, date, version }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default async function ReleasesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={SimpleErrorComponent}>
      <div className="h-full">
        <Suspense fallback={null}>
          <ReleasesList />
        </Suspense>
        {children}
      </div>
    </ErrorBoundary>
  );
}
