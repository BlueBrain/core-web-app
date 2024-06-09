'use client';

import React, { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from 'antd';

import { FormActiveLabel, FormError } from '../molecules/Form';
import { SourceDataItem } from './data';
import SourceDataPicker from './SourceDataPicker';
import initializePaperEntry from '@/services/paper-ai/initializePaperEntry';
import { PaperCreationAction } from '@/services/paper-ai/validation';

type Props = {
  virtualLabId: string;
  projectId: string;
};

function FormActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex w-full items-start justify-end gap-3 py-8">
      <Button
        htmlType="reset"
        type="text"
        size="large"
        className="rounded-none"
        form="create-project-paper-form"
      >
        Cancel
      </Button>
      <Button
        htmlType="submit"
        type="primary"
        size="large"
        className="rounded-none bg-primary-8 px-14"
        loading={pending}
        disabled={pending}
        form="create-project-paper-form"
      >
        Next
      </Button>
    </div>
  );
}

export default function Form({ virtualLabId, projectId }: Props) {
  const [sourcesData, updateSourcesData] = useState<Array<SourceDataItem>>([]);
  const [state, runPaperCreationAction] = useFormState<PaperCreationAction, FormData>(
    initializePaperEntry,
    {
      error: null,
      validationErrors: null,
      redirect: null,
    }
  );

  return (
    <form
      id="create-project-paper-form"
      name="create-project-paper-form"
      className="flex h-full flex-col items-start gap-4 py-4"
      action={runPaperCreationAction}
    >
      <input
        id="virtual-lab-id"
        name="virtual-lab-id"
        defaultValue={virtualLabId}
        readOnly
        hidden
      />
      <input id="project-id" name="project-id" defaultValue={projectId} readOnly hidden />
      <input id="source-data" name="source-data" value={JSON.stringify(sourcesData)} hidden />

      <div className="mb-2 w-full">
        <div className="flex w-full flex-col items-start justify-start">
          <FormActiveLabel title="Title" />
          <input
            type="text"
            id="title"
            name="title"
            className="block h-12 w-full rounded-none border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:outline-none"
            placeholder="Write your title..."
          />
        </div>
        {state?.validationErrors?.title && <FormError errors={state.validationErrors.title} />}
      </div>
      <div className="mb-4 w-full flex-grow">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <FormActiveLabel title="Summary" />
          <textarea
            id="summary"
            name="summary"
            rows={5}
            className="block h-full w-full rounded-none border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:outline-none"
            placeholder="Write your summary here..."
          />
        </div>
        {state?.validationErrors?.summary && <FormError errors={state.validationErrors.summary} />}
      </div>
      <div className="mb-2 w-full">
        <div className="flex w-full flex-col items-start justify-start">
          <div className="flex w-full items-center justify-between gap-2">
            <FormActiveLabel title="Source data" />
            {!!sourcesData.length && (
              <div className="text-primary-8">{sourcesData.length} selected</div>
            )}
          </div>
          <div className="relative w-full">
            <SourceDataPicker
              {...{
                sourcesData,
                updateSourcesData,
              }}
            />
          </div>
        </div>
        {state?.validationErrors?.sourceData && (
          <FormError errors={state.validationErrors.sourceData} />
        )}
      </div>
      <div className="mb-2 w-full">
        <div className="flex w-full items-center gap-2">
          <FormActiveLabel title="Generate outline" />
          <input
            type="checkbox"
            id="generate-outline"
            name="generate-outline"
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-8 focus:ring-primary-8"
          />
        </div>
        {state?.validationErrors?.generateOutline && (
          <FormError errors={state.validationErrors.generateOutline} />
        )}
      </div>
      <FormActions />
    </form>
  );
}
