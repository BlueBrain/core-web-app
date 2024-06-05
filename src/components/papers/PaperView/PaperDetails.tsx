import { useEffect } from 'react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useFormState, useFormStatus } from 'react-dom';
import { parseAsString, useQueryState } from 'nuqs';

import { EDIT_PAPER_FAILED, EDIT_PAPER_SUCCESS } from '../utils/messages';
import { FormError, FormStaleLabel } from '../molecules/Form';
import { PaperResource } from '@/types/nexus';
import { classNames } from '@/util/utils';
import { PaperUpdateAction } from '@/services/paper-ai/validation';
import updatePaperDetails from '@/services/paper-ai/updatePaperResource';
import useNotification from '@/hooks/notifications';

type PaperDetailsProps = {
  editable: boolean;
  paper: PaperResource;
  onCompleteEdit: (value: boolean) => void;
};

function PaperEditSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="primary"
      size="large"
      className="rounded-none bg-green-700 px-14"
      htmlType="submit"
      form="paper-details-form"
      disabled={pending}
      loading={pending}
    >
      Save
    </Button>
  );
}

export default function PaperDetails({ editable, paper, onCompleteEdit }: PaperDetailsProps) {
  const [, toggleEditableMode] = useQueryState(
    'mode',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const { success: successNotify, error: errorNotify } = useNotification();
  const [state, runPaperUpdateAction] = useFormState<PaperUpdateAction, FormData>(
    updatePaperDetails,
    {
      type: null,
      validationErrors: null,
      error: null,
    }
  );

  const onCancelEdit = () => {
    toggleEditableMode('');
  };

  useEffect(() => {
    if (state.type === 'success') {
      successNotify(EDIT_PAPER_SUCCESS, undefined, 'topRight');
      onCompleteEdit(false);
    } else if (state.type === 'error') {
      errorNotify(EDIT_PAPER_FAILED, undefined, 'topRight');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      id="paper-details-form"
      name="paper-details-form"
      className="flex flex-col"
      action={runPaperUpdateAction}
    >
      <div className="my-4 flex w-full flex-col gap-2 bg-white">
        <input id="paper" name="paper" value={JSON.stringify(paper)} />
        <div className="flex w-full flex-col">
          <FormStaleLabel title="Title" className={editable ? 'font-bold' : 'font-normal'} />
          {editable ? (
            <div className="w-full">
              <input
                id="title"
                name="title"
                defaultValue={paper.name}
                className="h-14 w-full border border-gray-200 px-4 py-2 font-bold text-primary-8"
              />
              {state.validationErrors?.title && <FormError errors={state.validationErrors.title} />}
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-primary-8">{paper.name}</h1>
          )}
        </div>
        <div className="flex flex-col">
          <FormStaleLabel title="Summary" className={editable ? 'font-bold' : 'font-normal'} />
          {editable ? (
            <div className="w-full">
              <textarea
                id="summary"
                name="summary"
                className={classNames(
                  'h-full w-full text-primary-8',
                  editable && 'h-full resize-y overflow-y-auto border border-gray-200 px-4 py-2'
                )}
                rows={4}
                defaultValue={paper.description}
              />
              {state.validationErrors?.summary && (
                <FormError errors={state.validationErrors.summary} />
              )}
            </div>
          ) : (
            <p className="text-primary-8">{paper.description}</p>
          )}
        </div>
        <div className="flex flex-col">
          <FormStaleLabel title="Source data" className={editable ? 'font-bold' : 'font-normal'} />
          {editable ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  className="flex w-max items-center gap-10 rounded-md border border-gray-200 px-4 py-5 font-bold text-primary-8"
                >
                  <span className="min-w-max text-left">cADpyr model</span>
                  <SwapOutlined className="-rotate-45 transform" />
                </button>
                <p className="line-clamp-2 text-red-500">
                  If you alter your source data, this will delete all generated information,
                  including the outline, abstract, summary, methods, and references. These will then
                  be replaced with those from the new source data.
                </p>
              </div>
              <div className="w-full">
                {state.validationErrors?.sourceData && (
                  <FormError errors={state.validationErrors.sourceData} />
                )}
              </div>
            </>
          ) : (
            'cADpyr model'
          )}
        </div>
      </div>
      {editable && (
        <div className="flex items-center justify-end gap-3 self-end">
          <Button
            htmlType="button"
            type="text"
            size="large"
            className="rounded-none px-4"
            onClick={onCancelEdit}
          >
            Cancel
          </Button>
          <PaperEditSubmit />
        </div>
      )}
    </form>
  );
}
