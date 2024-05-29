"use client";

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { SearchOutlined } from "@ant-design/icons";
import kebabCase from 'lodash/kebabCase';

import { ServerSideComponentProp } from '@/types/common';
import { PaperCreationAction } from '@/services/paper-ai/validation';
import initializePaperEntry from '@/services/paper-ai/initializePaperEntry';


function Label({ title }: { title: string }) {
  return (
    <span className="text-primary-8 text-base font-bold mb-1">{title}</span>
  )
}

function FormError({ errors }: { errors: string[] }) {
  return errors.map((err) => (
    <div
      key={`error-paper-${kebabCase(err)}`}
      className="flex text-sm text-rose-600 py-1"
    >
      {err}
    </div>
  ))
}

export default function CreatePaper({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {

  const { push: redirect } = useRouter();
  const [state, runPaperCreationAction, isPending] = useFormState<PaperCreationAction, FormData>(
    initializePaperEntry, {
    error: null,
    validationErrors: null,
    redirect: null
  });

  if (state.redirect) {
    redirect(state.redirect)
  }

  return (
    <div
      className="mt-4 max-h-[80vh] h-full bg-white p-8 flex flex-col w-full"
    >
      <h2 className="text-primary-8 text-3xl font-bold py-4">Create new paper</h2>
      <form
        name="create-project-paper-form"
        className="flex flex-col items-start h-full gap-4"
        action={runPaperCreationAction}
      >
        <input id='virtual-lab-id' name='virtual-lab-id' value={virtualLabId} readOnly hidden />
        <input id='project-id' name='project-id' value={projectId} readOnly hidden />

        <div className='w-full mb-2'>
          <div className="flex flex-col items-start justify-start w-full">
            <Label title="Title" />
            <input
              type="text"
              id="title"
              name="title"
              className="block w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none text-base text-gray-900 h-12"
              placeholder="Write your title..."
            />
          </div>
          {state.validationErrors?.title && <FormError errors={state.validationErrors.title} />}
        </div>
        <div className='w-full flex-grow mb-2'>
          <div className="flex flex-col items-start justify-start w-full h-full">
            <Label title="Summary" />
            <textarea
              id="summary"
              name="summary"
              className="h-full block w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none text-base text-gray-900"
              placeholder="Write your summary here..."
            />
          </div>
          {state.validationErrors?.summary && <FormError errors={state.validationErrors.summary} />}
        </div>
        <div className='w-full mb-2'>
          <div className="flex flex-col items-start justify-start w-full">
            <Label title="Source data" />
            <div className="relative w-full">
              <input
                type="text"
                name="source-data"
                id="source-data"
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none  text-base h-12 text-gray-900"
                placeholder="Select from library..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchOutlined className="text-primary-8" />
              </div>
            </div>
          </div>
          {state.validationErrors?.sourceData && <FormError errors={state.validationErrors.sourceData} />}
        </div>
        <div className='w-full mb-2'>
          <div className="flex items-center gap-2 w-full">
            <Label title="Generate outline" />
            <input
              type="checkbox"
              id="generate-outline"
              name="generate-outline"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          {state.validationErrors?.generateOutline && <FormError errors={state.validationErrors.generateOutline} />}
        </div>

        <div className="flex items-start justify-end w-full gap-3">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="bg-white hover:bg-gray-200 text-gray-800 font-semibold px-5  py-3 rounded-none text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-8 hover:bg-primary-6 text-white font-semibold rounded-none px-14 py-3 text-lg"
            disabled={isPending}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};


