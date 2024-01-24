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
            className="flex items-center text-primary-8 p-0 font-semibold ml-4 hover:bg-primary-0!"
            type="button"
          >
            Filter <SettingsIcon className="rotate-90 ml-2" />
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
        'flex flex-col items-center justify-center w-full pr-4',
        !isChatBarMustSlideInDown && !isBuildSection && 'fixed top-1/2 -translate-y-1/2',
        isBuildSection && !isChatBarMustSlideInDown && 'absolute top-1/2 -translate-y-1/2',
        isChatBarMustSlideInDown && 'absolute bottom-0 left-0 right-0'
      )}
    >
      <div
        className={classNames(
          'bg-white p-4 w-full left-0 z-50 rounded-2xl border border-gray-200 gap-2.5 max-w-4xl mx-auto right-4',
          'inline-flex flex-col justify-start items-start',
          isChatBarMustSlideInDown &&
            'transition-all duration-300 ease-out-expo rounded-b-none pb-0'
        )}
      >
        <div
          className={classNames(
            'inline-flex flex-col items-start justify-start w-full px-2 pt-4 pb-8',
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
