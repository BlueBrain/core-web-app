import { Empty, Spin } from 'antd';
import { useMemo } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import EphysPlot from '@/components/explore-section/EphysViewerContainer/EphysPlot';
import { ExperimentalTrace } from '@/types/explore-section/delta';
import createDistributionDataAtom from '@/components/explore-section/EphysViewerContainer/state/DistributionDataAtom';

interface GraphViewComponentProps {
  defaultStimulusType?: string;
  defaultRepetition?: string;
  resource: ExperimentalTrace;
}

function GraphViewComponent({
  defaultStimulusType,
  defaultRepetition,
  resource,
}: GraphViewComponentProps) {
  const loadableDataFetcher = useMemo(() => {
    const resourceID = resource['@id'];
    const [project, org] = resource._project.split('/').reverse();
    return loadable(createDistributionDataAtom(resourceID, org, project));
  }, [resource]);
  const dataAtom = useAtomValue(loadableDataFetcher);

  if (dataAtom.state === 'loading') {
    return <Spin />;
  }

  if (dataAtom.state === 'hasError') {
    return (
      <Empty className="p-2em" description="There was a problem loading the required resources" />
    );
  }

  return (
    <div>
      {dataAtom.data && (
        <EphysPlot
          options={dataAtom.data.datasets}
          index={dataAtom.data.RABIndex}
          defaultRepetition={defaultRepetition}
          defaultStimulusType={defaultStimulusType}
        />
      )}
    </div>
  );
}

export default GraphViewComponent;
