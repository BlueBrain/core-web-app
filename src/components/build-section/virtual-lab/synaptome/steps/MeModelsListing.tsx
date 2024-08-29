'use client';

import { useState } from 'react';
import { Form } from 'antd';
import { z } from 'zod';
import { WarningOutlined } from '@ant-design/icons';

import { SynaptomeModelConfigSteps } from '../molecules/types';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreDataScope } from '@/types/explore-section/application';
import { classNames } from '@/util/utils';
import { ExploreESHit, ExploreResource } from '@/types/explore-section/es';

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
  const { setFieldValue, validateFields } = Form.useFormInstance();
  const [selectedRows, setSelectedRows] = useState<ExploreESHit<ExploreResource>[]>([]);
  const [modelNotSelectedError, setModelNotSelectedError] = useState(false);

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

  return (
    <div
      className={classNames(
        'flex h-[calc(100vh-51px)] w-full flex-col p-10',
        configStep !== 'me-model-config' && 'hidden'
      )}
    >
      <input name="modelUrl" aria-hidden hidden />
      <div className="mb-4">
        <h1 className="text-xl font-bold text-primary-8">
          Select a single cell model to build a synaptom model
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
          onRowsSelected={(rows) => {
            setModelNotSelectedError(false);
            setSelectedRows(rows);
          }}
        />
      </div>
      <button
        type="button"
        className="fixed bottom-10 right-10 rounded-none bg-primary-8 px-5 py-4 text-white disabled:bg-neutral-400"
        onClick={proceed}
        disabled={!selectedRows.length}
      >
        Use single cell model
      </button>
    </div>
  );
}
