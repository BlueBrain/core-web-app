'use client';

import { useState } from 'react';
import { Form } from 'antd';
import { z } from 'zod';
import { WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import { SynaptomeModelConfigSteps } from '../molecules/types';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreDataScope } from '@/types/explore-section/application';
import { classNames } from '@/util/utils';
import { ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { to64 } from '@/util/common';

import useRowSelection from '@/components/explore-section/ExploreSectionListingView/useRowSelection';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';

type Props = {
  projectId: string;
  virtualLabId: string;
  configStep: SynaptomeModelConfigSteps;
  onConfigStep: (value: SynaptomeModelConfigSteps) => void;
};

const modelEsHit = z
  .array(
    z.object({
      _id: z.string(),
      _index: z.string(),
      _source: z.object({
        '@id': z.string(),
        _self: z.string().url(),
      }),
    })
  )
  .nonempty();

export default function MeModelsListing({
  virtualLabId,
  projectId,
  configStep,
  onConfigStep,
}: Props) {
  const form = Form.useFormInstance();
  const { push: navigate } = useRouter();
  const { setFieldValue, validateFields, getFieldValue } = Form.useFormInstance();
  const { selectedRows } = useRowSelection({ dataType: DataType.CircuitMEModel });
  const [modelNotSelectedError, setModelNotSelectedError] = useState(false);

  const { setSessionValue } = useSessionStorage<{
    name: string;
    description: string;
    basePath: string;
    record: ExploreESHit<ExploreResource>;
    selectedRows: Array<ExploreESHit<ExploreResource>> | null;
  } | null>(`me-model/${virtualLabId}/${projectId}`, null);

  const proceed = async () => {
    setModelNotSelectedError(false);
    await validateFields(['modelUrl']);
    if (modelEsHit.safeParse(selectedRows).success) {
      const value = selectedRows[0]._source['@id'];
      setFieldValue('modelUrl', value);
      onConfigStep('placement-config');
    } else {
      setModelNotSelectedError(true);
    }
  };

  const onNavigateToMeModel = (basePath: string, record: ExploreESHit<ExploreResource>): void => {
    setSessionValue({
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      basePath,
      record,
      selectedRows,
    });
    const url = `/virtual-lab/lab/${virtualLabId}/project/${projectId}/explore/interactive/model/me-model/${to64(`${record._source.project.label}!/!${record._id}`)}`;
    navigate(url);
  };

  return (
    <div
      className={classNames(
        'flex h-[calc(100vh-51px)] w-full flex-col p-10',
        configStep !== 'me-model-config' && 'hidden'
      )}
    >
      <Form.Item name="modelUrl" hidden>
        <input name="modelUrl" aria-hidden hidden defaultValue={getFieldValue('modelUrl')} />
      </Form.Item>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-primary-8">
          Select a single neuron model to build a synaptome model
        </h1>
        {modelNotSelectedError && (
          <i className="text-pink-700">
            <WarningOutlined />
            You have to select an ME model to proceed to syanpses configuration.
          </i>
        )}
      </div>
      <div id="explore-table-container-for-observable" className="h-full w-full overflow-auto pb-5">
        <ExploreSectionListingView
          tableScrollable
          controlsVisible={false}
          dataType={DataType.CircuitMEModel}
          dataScope={ExploreDataScope.SelectedBrainRegion}
          virtualLabInfo={{ virtualLabId, projectId }}
          selectionType="radio"
          onRowsSelected={() => {
            setModelNotSelectedError(false);
          }}
          onCellClick={onNavigateToMeModel}
        />
      </div>
      <button
        type="button"
        className="fixed bottom-10 right-10 rounded-none bg-primary-8 px-7 py-4 text-white disabled:bg-neutral-400"
        onClick={proceed}
        disabled={!selectedRows.length}
      >
        Use single neuron model
      </button>
    </div>
  );
}
