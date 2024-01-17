import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { atomFamily, loadable, selectAtom } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
import sessionAtom from '@/state/session';
import { createHeaders } from '@/util/utils';
import { FileDistribution } from '@/types/explore-section/es-properties';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import MorphoThumbnail from '@/components/explore-section/ExploreSectionListingView/MorphoThumbnail';

type CardVisualizationProps = {
  experimentTypeName: string;
  resource: ReconstructedNeuronMorphology | ExperimentalTrace;
};

const swcFileAtom = atomFamily((contentUrl?: string) =>
  selectAtom(sessionAtom, (session) => {
    if (!session || !contentUrl) return null;
    return fetch(contentUrl, {
      headers: createHeaders(session.accessToken, { Accept: '*/*' }),
    }).then((res) => res.text());
  })
);

export default function CardVisualization({
  experimentTypeName,
  resource,
}: CardVisualizationProps) {
  const contentUrl = resource.distribution?.find(
    (dis: FileDistribution) => dis.encodingFormat === 'application/swc'
  )?.contentUrl;

  const swc = useAtomValue(useMemo(() => loadable(swcFileAtom(contentUrl)), [contentUrl]));

  const renderSwc = () => {
    switch (swc.state) {
      case 'loading':
        return (
          <Spin
            size="large"
            className="h-full w-full flex items-center justify-center"
            indicator={<LoadingOutlined />}
          />
        );
      case 'hasData':
        return (
          !!contentUrl && (
            <MorphoThumbnail contentUrl={contentUrl} dpi={300} height={350} width={350} />
          )
        );
      default:
        return <div>default</div>;
    }
  };

  if (experimentTypeName === NEURON_MORPHOLOGY) {
    return renderSwc();
  }
  return (
    <div className="text-primary-7 flex h-full w-full flex items-center justify-center gap-2">
      <WarningOutlined /> Visualization is not available in this type
    </div>
  );
}
