import { useAtomValue } from 'jotai';

import { meModelResourceAtom } from '@/state/virtual-lab/build/me-model';
import { PDFViewerContainer } from '@/components/explore-section/common/pdf/PDFViewerContainer';
import { AnalysisFileType } from '@/components/explore-section/common/pdf/types';
import { composeUrl, ensureArray } from '@/util/nexus';
import { FileDistribution } from '@/types/explore-section/delta-properties';
import { nexus } from '@/config';

const categoryMap: Record<string, string> = {
  [`${nexus.defaultIdBaseUrl}/traces`]: AnalysisFileType.Traces,
  [`${nexus.defaultIdBaseUrl}/scores`]: AnalysisFileType.Scores,
  [`${nexus.defaultIdBaseUrl}/parameters_distribution`]: AnalysisFileType.Distribution,
  [`${nexus.defaultIdBaseUrl}/thumbnail`]: AnalysisFileType.Thumbnail,
  [`${nexus.defaultIdBaseUrl}/currentscape`]: AnalysisFileType.Currentscape,
};

export default function AnalysisPreview() {
  const meModelResource = useAtomValue(meModelResourceAtom);
  const image = meModelResource?.image;

  if (!image || meModelResource?.status !== 'done') {
    return (
      <div className="flex h-full items-center justify-center text-4xl font-bold text-primary-9">
        ME-Model analysis are being generated
      </div>
    );
  }

  const distributions = ensureArray(image).map((i) => {
    let encodingFormat = 'application/pdf';

    if (i.about?.includes('thumbnail')) {
      encodingFormat = 'application/png';
    }
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
      encodingFormat,
      atLocation: {} as FileDistribution['atLocation'],
    } satisfies FileDistribution;
  });

  return <PDFViewerContainer distributions={distributions} />;
}
