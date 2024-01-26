import path from 'path';
import { promises as fs } from 'fs';
import { Metadata } from 'next';

import Release from '@/components/About/Release/Detail';

async function getOneRelease(_id: string) {
  const file = await fs.readFile(path.resolve(`./public/mock-data/releases-details.json`), 'utf8');
  return JSON.parse(file);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const release = await getOneRelease(params.id);
  return { title: release.title, description: release.description };
}

export default async function ReleasePage({ params }: { params: { 'release-id': string } }) {
  const releaseId = params['release-id'];
  const release = await getOneRelease(releaseId);

  return <Release release={release} />;
}
