'use client';

import { memo, useReducer } from 'react';
import { Button, Tooltip } from 'antd';
import { useAtomValue } from 'jotai';
import { SendOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { useContextSearchParams, useLiteratureDataSource } from '../useContextualLiteratureContext';
import QAForm from './GenerativeQAForm';
import QuestionParameters from './QuestionParameters';
import { classNames } from '@/util/utils';
import { literatureAtom } from '@/state/literature';

const REFINE_SEARCH_HELP_TEXT = `Before launching the search related to your question,
 use these parameters to obtain a more 
 specific answer.`;

function SearchButton({ isParametersVisible }: { isParametersVisible: boolean }) {
  const { query, isGenerating } = useAtomValue(literatureAtom);
  const isQuestionEmpty = query.trim().length === 0;
  return (
    <div className={classNames('justify-end w-full mb-4', isParametersVisible ? 'flex' : 'hidden')}>
      <button
        type="submit"
        disabled={isQuestionEmpty || isGenerating}
        title={isQuestionEmpty ? 'Please enter a question' : ''}
        className="border-[1px] border-solid border-gray rounded px-4 py-2 text-primary-8 disabled:text-gray-400"
      >
        Search <SendOutlined className="text-base -rotate-[30deg] ml-1" />
      </button>
    </div>
  );
}

function QASettings() {
  const [isParametersVisible, toggleParametersVisible] = useReducer((val) => !val, false);
  return (
    <>
      <div
        className={classNames(
          'items-center justify-end w-full mt-4',
          !isParametersVisible ? 'flex' : 'hidden'
        )}
      >
        <span className="text-primary-8">Refine your search</span>
        <Tooltip
          title={REFINE_SEARCH_HELP_TEXT}
          color="#003A8C"
          overlayInnerStyle={{ background: '#003A8C' }}
        >
          <InfoCircleOutlined className="mx-2 text-primary-5" />
        </Tooltip>
        <Button
          onClick={toggleParametersVisible}
          className="border rounded-none border-primary-4 text-primary-8 bg-primary-0"
        >
          Parameters
        </Button>
      </div>
      <QuestionParameters
        isParametersVisible={isParametersVisible}
        setIsParametersVisible={toggleParametersVisible}
      />
      <SearchButton {...{ isParametersVisible }} />
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
          'bg-white p-4 w-full left-0 z-50 rounded-2xl border border-zinc-100 gap-2.5 max-w-4xl mx-auto right-4',
          'inline-flex flex-col justify-start items-start',
          isChatBarMustSlideInDown &&
            'transition-all duration-300 ease-out-expo rounded-b-none pb-0'
        )}
      >
        <div
          className={classNames(
            'inline-flex flex-col items-start justify-start w-full px-6 py-8 bg-primary-0',
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
