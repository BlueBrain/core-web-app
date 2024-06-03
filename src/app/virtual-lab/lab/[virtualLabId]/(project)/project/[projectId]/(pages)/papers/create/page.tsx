'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { ServerSideComponentProp } from '@/types/common';
import { PaperCreationAction } from '@/services/paper-ai/validation';
import initializePaperEntry from '@/services/paper-ai/initializePaperEntry';
import { FormActiveLabel, FormError } from '@/components/papers/molecules/Form';

function FormActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex w-full items-start justify-end gap-3">
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

export default function CreatePaper({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const [state, runPaperCreationAction] = useFormState<PaperCreationAction, FormData>(
    initializePaperEntry,
    {
      error: null,
      validationErrors: null,
      redirect: null,
    }
  );

  return (
    <div className="mt-4 flex h-full max-h-[80vh] w-full flex-col bg-white p-8">
      <h2 className="py-4 text-3xl font-bold text-primary-8">Create new paper</h2>
      <form
        id="create-project-paper-form"
        name="create-project-paper-form"
        className="flex h-full flex-col items-start gap-4"
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
        <div className="mb-2 w-full flex-grow">
          <div className="flex h-full w-full flex-col items-start justify-start">
            <FormActiveLabel title="Summary" />
            <textarea
              id="summary"
              name="summary"
              className="block h-full w-full rounded-none border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:outline-none"
              placeholder="Write your summary here..."
            />
          </div>
          {state?.validationErrors?.summary && (
            <FormError errors={state.validationErrors.summary} />
          )}
        </div>
        <div className="mb-2 w-full">
          <div className="flex w-full flex-col items-start justify-start">
            <FormActiveLabel title="Source data" />
            <div className="relative w-full">
              <input
                type="text"
                name="source-data"
                id="source-data"
                className="h-12 w-full rounded-none border border-gray-300 px-3 py-2 text-base  text-gray-900 shadow-sm focus:outline-none"
                placeholder="Select from library..."
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <SearchOutlined className="text-primary-8" />
              </div>
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
    </div>
  );
}
