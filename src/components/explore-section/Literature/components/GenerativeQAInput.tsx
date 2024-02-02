'use client';

import { memo } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { useContextSearchParams, useLiteratureDataSource } from '../useContextualLiteratureContext';
import QAForm from './GenerativeQAForm';
import QuestionParameters from './QuestionParameters';
import { classNames } from '@/util/utils';
import { initialParameters, literatureAtom, questionsParametersAtom } from '@/state/literature';
import { SettingsIcon } from '@/components/icons';

function QASettings() {
  const [{ areQAParamsVisible, isGenerating }, updateLiterature] = useAtom(literatureAtom);
  const resetParameters = useSetAtom(questionsParametersAtom);

  return (
    <>
      <div className={classNames('', areQAParamsVisible ? 'hidden' : 'inline-block')}>
        {!isGenerating && (
          <button
            onClick={() => updateLiterature((prev) => ({ ...prev, areQAParamsVisible: true }))}
            className="hover:bg-primary-0! ml-4 flex items-center p-0 font-semibold text-primary-8"
            type="button"
          >
            Filter <SettingsIcon className="ml-2 rotate-90" />
          </button>
        )}
      </div>
      <QuestionParameters
        areQAParamsVisible={areQAParamsVisible}
        closeQAParams={() => {
          updateLiterature((prev) => ({ ...prev, areQAParamsVisible: false }));
          resetParameters(initialParameters);
        }}
      />
    </>
  );
}

function GenerativeQABar() {
  const { isBuildSection } = useContextSearchParams();
  const dataSource = useLiteratureDataSource();
  const isChatBarMustSlideInDown = Boolean(dataSource.length);

  return (
    <div
      className={classNames(
        'flex w-full flex-col items-center justify-center pr-4',
        !isChatBarMustSlideInDown && !isBuildSection && 'fixed top-1/2 -translate-y-1/2',
        isBuildSection && !isChatBarMustSlideInDown && 'absolute top-1/2 -translate-y-1/2',
        isChatBarMustSlideInDown && 'absolute bottom-0 left-0 right-0'
      )}
    >
      <div
        className={classNames(
          'left-0 right-4 z-50 mx-auto w-full max-w-4xl gap-2.5 rounded-2xl border border-gray-200 bg-white p-4',
          'inline-flex flex-col items-start justify-start',
          isChatBarMustSlideInDown &&
            'rounded-b-none pb-0 transition-all duration-300 ease-out-expo'
        )}
      >
        <div
          className={classNames(
            'inline-flex w-full flex-col items-start justify-start px-2 pb-8 pt-4',
            isChatBarMustSlideInDown ? 'rounded-b-none' : 'rounded-lg'
          )}
        >
          <QAForm key="main-literature-form">
            <QASettings />
          </QAForm>
        </div>
      </div>
    </div>
  );
}

export default memo(GenerativeQABar);
