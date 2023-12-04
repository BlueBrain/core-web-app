import fs from 'fs/promises';
import path from 'path';
import { Suspense } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';

import CardList, { RoadmapFeature, Metadata } from '@/components/About/Roadmap/List';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

async function getRoadmapFeatures(): Promise<Array<RoadmapFeature>> {
  const roadmap = await fs.readFile(path.resolve('./public/mock-data/roadmap.json'), 'utf8');
  try {
    const roadmapJSON = JSON.parse(roadmap);
    return roadmapJSON.features;
  } catch (error) {
    throw new Error('Failed to parse roadmap features');
  }
}

async function getRoadmapMetadata() {
  const roadmap = await fs.readFile(path.resolve('./public/mock-data/roadmap.json'), 'utf8');
  try {
    const roadmapJSON = JSON.parse(roadmap);
    return {
      time: roadmapJSON.time,
      categories: roadmapJSON.categories,
    };
  } catch (error) {
    throw new Error('Failed to parse roadmap features');
  }
}

async function Roadmap() {
  const { categories, time } = await getRoadmapMetadata();
  return <Metadata {...{ time, categories }} />;
}

async function FeaturesList() {
  const allFeatures = await getRoadmapFeatures();
  return <CardList {...{ allFeatures }} />;
}

export default async function RoadmapPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <ErrorBoundary fallback={SimpleErrorComponent}>
        <Suspense fallback={null}>
          <Roadmap />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={SimpleErrorComponent}>
        <Suspense fallback={null}>
          <FeaturesList />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
