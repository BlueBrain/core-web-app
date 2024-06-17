import { useEffect, useState, useTransition } from 'react';
import { Button } from 'antd';
import { useFormState, useFormStatus } from 'react-dom';
import { parseAsString, useQueryState } from 'nuqs';

import {
  DELETE_SOURCE_DATA_FAILED,
  DELETE_SOURCE_DATA_SUCCESS,
  EDIT_PAPER_FAILED,
  EDIT_PAPER_SUCCESS,
} from '../utils/messages';
import { FormError, FormStaleLabel } from '../molecules/Form';
import SourceDataListing from '../PaperCreationView/SourceData/Listing';
import { SourceDataItem } from '../PaperCreationView/data';
import { PaperResource } from '@/types/nexus';
import { classNames } from '@/util/utils';
import { PaperUpdateAction } from '@/services/paper-ai/validation';
import updatePaperDetails from '@/services/paper-ai/updatePaperResource';
import useNotification from '@/hooks/notifications';
import deleteOnePaperSourceData from '@/services/paper-ai/deleteOnePaperSourceData';

type PaperDetailsProps = {
  paper: PaperResource;
  onCompleteEdit: (value: boolean) => void;
};

function PaperEditSubmit() {
  const { pending } = useFormStatus();
  const [, toggleEditableMode] = useQueryState(
    'mode',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const onCancelEdit = () => toggleEditableMode('');

  return (
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
    </div>
  );
}

export default function PaperDetails({ paper, onCompleteEdit }: PaperDetailsProps) {
  const [deletingSourceData, startTransition] = useTransition();
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
  const [mode] = useQueryState(
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

  const editable = mode === 'edit';

  const onDeleteSourceData = async (resource: SourceDataItem) => {
    setSourceToDelete(resource.id);
    startTransition(async () => {
      const result = await deleteOnePaperSourceData(paper, resource);
      if (result.status === 'success') {
        successNotify(
          DELETE_SOURCE_DATA_SUCCESS.replace('$$', resource.name),
          undefined,
          'topRight'
        );
      } else if (result.status === 'error') {
        errorNotify(DELETE_SOURCE_DATA_FAILED.replace('$$', resource.name), undefined, 'topRight');
      }
      setSourceToDelete(null);
    });
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
      <div className="my-4 flex w-full flex-col gap-8 bg-white">
        <input id="paper" name="paper" defaultValue={JSON.stringify(paper)} hidden />
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
        {!editable && (
          <div className="flex flex-col">
            <FormStaleLabel
              title={`Source data ${paper.sourceData.length ? paper.sourceData.length : ''}`}
              className={editable ? 'font-bold' : 'font-normal'}
            />
            <SourceDataListing
              {...{
                onDeleteSourceData,
                sourceToDelete,
                deleting: deletingSourceData,
                dataSource: paper.sourceData,
              }}
            />
          </div>
        )}
      </div>
      {editable && <PaperEditSubmit />}
    </form>
  );
}
