import { useAtomValue } from 'jotai';

import { meModelResourceAtom } from '@/state/virtual-lab/build/me-model';
import { PDFViewerContainer } from '@/components/explore-section/EModel/DetailView/PDFViewerContainer';
import { composeUrl, ensureArray } from '@/util/nexus';
import { FileDistribution } from '@/types/explore-section/delta-properties';
import { nexus } from '@/config';

const categoryMap: Record<string, string> = {
  [`${nexus.defaultIdBaseUrl}/traces`]: 'traces.pdf',
  [`${nexus.defaultIdBaseUrl}/scores`]: 'scores.pdf',
  [`${nexus.defaultIdBaseUrl}/parameters_distribution`]: 'distribution.pdf',
  [`${nexus.defaultIdBaseUrl}/thumbnail`]: 'thumbnail.pdf',
  [`${nexus.defaultIdBaseUrl}/currentscape`]: 'currentscape.pdf',
};

export default function AnalysisPreview() {
  const meModelResource = useAtomValue(meModelResourceAtom);
  const image = meModelResource?.image;

  if (!image) return null;

  const distributions = ensureArray(image).map((i) => {
    // to be used in filter dropdown of PDFViewerContainer
    const name = i.about ? categoryMap[i.about] : 'unknown.pdf';
    return {
      ...i,
      '@type': 'DataDownload',
      name,
      contentSize: {
        unitCode: 'bytes',
        value: 0,
      },
      contentUrl: composeUrl('file', i['@id']),
      encodingFormat: 'application/pdf',
      atLocation: {} as FileDistribution['atLocation'],
    } satisfies FileDistribution;
  });

  return <PDFViewerContainer distributions={distributions} />;
}
