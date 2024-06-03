import React from 'react';
import { useFormState } from 'react-dom';

import { FormActiveLabel, FormError } from '../molecules/Form';
import SourceDataPicker from './SourceDataPicker';
import FormActions from './FormActions';
import initializePaperEntry from '@/services/paper-ai/initializePaperEntry';
import { PaperCreationAction } from '@/services/paper-ai/validation';

type Props = {
  virtualLabId: string;
  projectId: string;
};

export default function Form({ virtualLabId, projectId }: Props) {
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
      <input id="virtual-lab-id" name="virtual-lab-id" value={virtualLabId} readOnly hidden />
      <input id="project-id" name="project-id" value={projectId} readOnly hidden />

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
          <FormActiveLabel title="Source data" />
          <div className="relative w-full">
            <input
              hidden
              readOnly
              type="text"
              name="source_data[]"
              id="source_data[]"
              className="h-12 w-full rounded-none border border-gray-300 px-3 py-2 text-base  text-gray-900 shadow-sm focus:outline-none"
              placeholder="Select from library..."
            />
            <SourceDataPicker />
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
