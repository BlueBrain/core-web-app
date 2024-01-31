import path from 'path';
import { promises as fs } from 'fs';
import { Metadata } from 'next';

import RoadmapFeatureDetail, { RoadmapFeatureDetailProps } from '@/components/About/Roadmap/Detail';

async function getOneFeature(_id: string): Promise<RoadmapFeatureDetailProps> {
  const file = await fs.readFile(path.resolve('./public/mock-data/roadmap-details.json'), 'utf8');

  return JSON.parse(file);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const feature = await getOneFeature(params.id);
  return { title: feature.title, description: feature.description };
}

export default async function RoadmapFeaturePage({ params }: { params: { 'feature-id': string } }) {
  const featureId = params['feature-id'];
  const { id, title, description, notes, category } = await getOneFeature(featureId);

  return <RoadmapFeatureDetail {...{ id, title, description, notes, category }} />;
}
