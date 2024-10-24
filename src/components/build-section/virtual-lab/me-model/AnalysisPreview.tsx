import { useAtomValue } from 'jotai';

import { meModelResourceAtom } from '@/state/virtual-lab/build/me-model';
import { PDFViewerContainer } from '@/components/explore-section/common/pdf/PDFViewerContainer';
import { AnalysisFileType } from '@/components/explore-section/common/pdf/types';
import { composeUrl, ensureArray } from '@/util/nexus';
import { FileDistribution } from '@/types/explore-section/delta-properties';

const categoryMap: Record<string, string> = {
  traces: AnalysisFileType.Traces,
  scores: AnalysisFileType.Scores,
  parameters_distribution: AnalysisFileType.Distribution,
  thumbnail: AnalysisFileType.Thumbnail,
  currentscape: AnalysisFileType.Currentscape,
};

export default function AnalysisPreview() {
  const meModelResource = useAtomValue(meModelResourceAtom);
  const image = meModelResource?.image;

  if (!image || meModelResource?.status !== 'done') {
    return (
      <div className="flex h-full items-center justify-center text-4xl font-bold text-primary-9">
        No ME-Model analysis yet
      </div>
    );
  }

  const distributions = ensureArray(image).map((i) => {
    const encodingFormat = i.about?.includes('thumbnail') ? 'image/png' : 'application/pdf';

    const category = i.about?.split('/').at(-1);
    const name = category ? categoryMap[category] : 'unknown.pdf';

    const [org, project] = i['@id'].split('/').slice(-3, -1);

    return {
      ...i,
      '@type': 'DataDownload',
      name,
      contentSize: {
        unitCode: 'bytes',
        value: 0,
      },
      contentUrl: composeUrl('file', i['@id'], { org, project }),
      encodingFormat,
      atLocation: {} as FileDistribution['atLocation'],
    } satisfies FileDistribution;
  });

  return <PDFViewerContainer distributions={distributions} />;
}
