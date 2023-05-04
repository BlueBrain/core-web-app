import { Empty, Spin } from 'antd';
import { DataSets, RABIndex } from '@/types/explore-section/index';
import EphysPlot from '@/components/explore-section/EphysViewerContainer/EphysPlot';

interface GraphViewComponentProps {
  defaultStimulusType?: string;
  defaultRepetition?: string;
  traceCollectionData: {
    loading: boolean;
    error: Error | null;
    data: {
      RABIndex: RABIndex;
      datasets: DataSets;
    } | null;
  };
}
function GraphViewComponent({
  traceCollectionData,
  defaultStimulusType,
  defaultRepetition,
}: GraphViewComponentProps) {
  return (
    <div>
      <Spin spinning={traceCollectionData.loading}>
        {!!traceCollectionData.data && (
          <EphysPlot
            options={traceCollectionData.data.datasets}
            index={traceCollectionData.data.RABIndex}
            defaultRepetition={defaultRepetition}
            defaultStimulusType={defaultStimulusType}
          />
        )}
        {!traceCollectionData.data && traceCollectionData.loading && (
          <Empty className="p-2em" description="Fetching new data" />
        )}
        {!traceCollectionData.data && !traceCollectionData.loading && (
          <Empty className="p-2em" description="No data/ No RAB available" />
        )}
        {traceCollectionData.error && (
          <Empty
            className="p-2em"
            description={`There was a problem loading the required resources: ${traceCollectionData.error.message}`}
          />
        )}
      </Spin>
    </div>
  );
}

export default GraphViewComponent;
