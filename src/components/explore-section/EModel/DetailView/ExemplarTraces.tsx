import { Divider, Popover, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { GlobalOutlined } from '@ant-design/icons';
import { ErrorBoundary } from 'react-error-boundary';

import FeatureSelectionContainer from '@/components/build-section/cell-model-assignment/e-model/EModelView/FeatureSelectionContainer';
import DefaultEModelTable from '@/components/build-section/cell-model-assignment/e-model/EModelView/DefaultEModelTable';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

import { previewRender } from '@/constants/explore-section/fields-config/common';
import { eCodesDocumentationUrl } from '@/constants/cell-model-assignment/e-model';
import { useUnwrappedValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { experimentalTracesAtomFamily } from '@/state/e-model';
import { ExperimentalTracesDataType } from '@/types/e-model';

type Params = {
  id: string;
  projectId: string;
  virtualLabId: string;
};

const nameRenderFn = (name: string) => <div className="font-bold">{name}</div>;

const eCodesLink = (
  <div className="w-[100px]">
    <a href={eCodesDocumentationUrl} target="_blank">
      More info about e-codes <GlobalOutlined />
    </a>
    <Divider />
  </div>
);

// Note: This is a working duplicate of ExperimentalTraces component. We should merge them at some point

export default function ExemplarTraces({ params }: { params: Params }) {
  const info = useResourceInfoFromPath();

  const detail = useUnwrappedValue(detailFamily(info));
  const eModelExemplarTraces = useUnwrappedValue(
    experimentalTracesAtomFamily({
      eModelId: detail?.['@id'] || '',
      projectId: params.projectId,
      virtualLabId: params.virtualLabId,
    })
  );

  const columns: ColumnsType<ExperimentalTracesDataType> = [
    {
      title: 'PREVIEW',
      key: 'preview',
      width: 200,
      render: (trace: ExperimentalTracesDataType) => previewRender(trace),
    },
    {
      title: 'CELL NAME',
      dataIndex: 'cellName',
      key: 'name',
      render: nameRenderFn,
    },
    {
      title: 'M-TYPE',
      dataIndex: 'mType',
      key: 'mType',
    },
    {
      title: 'E-TYPE',
      dataIndex: 'eType',
      key: 'eType',
    },
    {
      title: 'E-CODE',
      key: 'eCode',
      render: (trace: ExperimentalTracesDataType) => {
        const list = (
          <div>
            {eCodesLink}
            {trace.eCodes.map((ecode) => (
              <p key={ecode}>{ecode}</p>
            ))}
          </div>
        );
        return (
          <Popover trigger="hover" content={list} placement="left">
            {trace.eCodes.length}
          </Popover>
        );
      },
    },
    {
      title: 'SUBJECT SPECIES',
      dataIndex: 'subjectSpecies',
      key: 'subjectSpecies',
    },
  ];
  return (
    <>
      <div className="text-2xl font-bold text-primary-8">Exemplar Traces</div>

      {eModelExemplarTraces ? (
        <>
          <DefaultEModelTable dataSource={eModelExemplarTraces} columns={columns} />
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <FeatureSelectionContainer />
            </DefaultLoadingSuspense>
          </ErrorBoundary>
        </>
      ) : (
        <Spin />
      )}
    </>
  );
}
