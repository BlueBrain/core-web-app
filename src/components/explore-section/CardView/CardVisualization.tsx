import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { atomFamily, loadable, selectAtom } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { DataType } from '@/constants/explore-section/list-views';
import sessionAtom from '@/state/session';
import { createHeaders } from '@/util/utils';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import PreviewThumbnail from '@/components/explore-section/ExploreSectionListingView/PreviewThumbnail';
import { useSwcContentUrl } from '@/util/content-url';
import { NeuronMorphology } from '@/types/e-model';

type CardVisualizationProps = {
  dataType: DataType;
  resource: ReconstructedNeuronMorphology | ExperimentalTrace | NeuronMorphology;
  height?: number;
  width?: number;
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
  dataType,
  resource,
  height = 350,
  width = 350,
}: CardVisualizationProps) {
  const contentUrl = useSwcContentUrl(resource.distribution);

  const swc = useAtomValue(useMemo(() => loadable(swcFileAtom(contentUrl)), [contentUrl]));

  const renderSwc = () => {
    switch (swc.state) {
      case 'loading':
        return (
          <Spin
            size="large"
            className="flex h-full w-full items-center justify-center"
            indicator={<LoadingOutlined />}
          />
        );
      case 'hasData':
        return (
          !!contentUrl && (
            <PreviewThumbnail
              contentUrl={contentUrl}
              dpi={300}
              height={height}
              type={DataType.ExperimentalNeuronMorphology}
              width={width}
            />
          )
        );
      default:
        return <div>default</div>;
    }
  };

  if (dataType === DataType.ExperimentalNeuronMorphology) {
    return renderSwc();
  }
  return (
    <div className="flex flex h-full w-full items-center justify-center gap-2 text-primary-7">
      <WarningOutlined /> Visualization is not available in this type
    </div>
  );
}
