'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { ConfigProvider, Drawer } from 'antd';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import kebabCase from 'lodash/kebabCase';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import keys from 'lodash/keys';
import omit from 'lodash/omit';

import ItemTile from './ItemTile';
import { buildQuestionsList, destructPath } from './util';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  contextualLiteratureAtom,
  literatureAtom,
  literatureResultAtom,
  promptResponseNodesAtomFamily,
} from '@/state/literature';
import { updateAndMerge } from '@/components/explore-section/Literature/utils';
import { GenerativeQA } from '@/types/literature';
import { classNames } from '@/util/utils';
import { useContextSearchParams } from '@/components/explore-section/Literature/useContextualLiteratureContext';
import withStreamResult from '@/components/explore-section/Literature/components/QAResult/ResultWithStream';
import QAForm from '@/components/explore-section/Literature/components/GenerativeQAForm';
import usePathname from '@/hooks/pathname';
import { ResultWithoutId } from '@/components/explore-section/Literature/useStreamGenerative';

function RedirectionButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-3 bg-white border border-gray-400 w-max hover:bg-primary-8 group"
    >
      <span className="text-base font-bold text-primary-8 group-hover:text-white">{title}</span>
    </button>
  );
}

function BackButton({ onSlideBack }: { onSlideBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onSlideBack}
      className="inline-flex items-center px-4 py-3 rounded-md hover:bg-gray-50"
    >
      <ArrowLeftOutlined className="mr-2 text-base text-gray-400" />
      <span className="text-base font-normal text-gray-500">Back to all questions</span>
    </button>
  );
}

function CurratedQuestions({
  curratedQuestions,
  onSelectQuestion,
}: {
  curratedQuestions: Record<string, JSX.Element>;
  onSelectQuestion: (key: string) => () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full px-2 gap-y-2">
      {curratedQuestions &&
        Object.entries(curratedQuestions).map(([key, question], index) => (
          <ItemTile
            key={kebabCase(key)}
            onSelect={onSelectQuestion(key)}
            {...{ index: index + 1, question }}
          />
        ))}
    </div>
  );
}

function ContextualContainer({ children }: { children: React.ReactNode }) {
  const [{ drawerOpen }, updateContext] = useAtom(contextualLiteratureAtom);
  const { controller } = useAtomValue(literatureAtom);
  const onDrawerClose = () => {
    controller?.abort();
    updateContext((prev) => ({ ...prev, drawerOpen: false }));
  };

  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Drawer
        mask={false}
        maskClosable
        destroyOnClose
        maskClassName="!bg-transparent"
        open={drawerOpen}
        onClose={onDrawerClose}
        rootClassName="!primary-scrollbar [&>.ant-drawer-content-wrapper]:rounded-bl-2xl"
        className="rounded-bl-2xl py-3 [&>.ant-drawer-wrapper-body]:!h-[calc(100%-100px)] [&>.ant-drawer-wrapper-body>.ant-drawer-body]:!primary-scrollbar [&>.ant-drawer-wrapper-body]:flex [&>.ant-drawer-wrapper-body]:flex-col-reverse"
        title={null}
        closeIcon={null}
        width="40vw"
        rootStyle={{
          margin: '20px 0',
        }}
        styles={{
          body: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            overflowY: 'auto',
          },
        }}
      >
        {children}
      </Drawer>
    </ConfigProvider>
  );
}

function ContextualContent() {
  const { push: navigate, replace: routeReplace } = useRouter();
  const pathname = usePathname();
  const streamRef = useRef<HTMLDivElement>(null);
  const updateLiteratureAtom = useSetAtom(literatureAtom);
  const updateResults = useSetAtom(literatureResultAtom);
  const densityOrCount = useAtomValue(densityOrCountAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const { controller } = useAtomValue(literatureAtom);
  const [{ currentQuestion, subject, about }, updateContext] = useAtom(contextualLiteratureAtom);
  const [currentSlide, setCurrentSlide] = useState<'questions' | 'results'>('questions');
  const { searchParams, clearContextSearchParams } = useContextSearchParams();
  const { step } = destructPath(pathname!);
  const [curratedQuestions, setCurratedQuestions] = useReducer(
    (state: Record<string, JSX.Element>, value: Record<string, JSX.Element>) => ({
      ...state,
      ...value,
    }),
    {}
  );

  const extra = {
    buildStep: step,
    parameter: about,
    DensityOrCount: densityOrCount,
  };

  const [promptResponseNode, updatePromptResponseNode] = useAtom(
    promptResponseNodesAtomFamily({ key: currentQuestion! })
  );

  const currentQuestionIndex = findIndex(keys(curratedQuestions), (v) => v === currentQuestion) + 1;
  const currentQuestionElement = get(curratedQuestions, currentQuestion!);

  const onDrawerClose = () => {
    controller?.abort();
    updateContext((prev) => ({ ...prev, drawerOpen: false }));
  };

  const onSlideForward = () => setCurrentSlide('results');
  const onSlideBack = () => {
    controller?.abort();
    setCurrentSlide('questions');
    updateContext((prev) => ({ ...prev, currentQuestion: undefined }));
  };

  const onSelectQuestion = (key: string) => () => {
    onSlideForward();
    updateContext((prev) => ({ ...prev, currentQuestion: key }));
    updateLiteratureAtom((prev) => ({ ...prev, query: key }));
  };

  const gotoOptionMode = () => {
    onDrawerClose();
    updateLiteratureAtom((prev) => ({ ...prev, query: '' }));
    const params = clearContextSearchParams(searchParams);
    params.set('contextual', 'true');
    params.set('context', 'more-options');
    navigate(`/build/${step}/literature?${params.toString()}`);
  };

  const gotoAskMoreMode = () => {
    onDrawerClose();
    updateLiteratureAtom((prev) => ({ ...prev, query: '' }));
    const params = clearContextSearchParams(searchParams);
    params.set('contextual', 'true');
    params.set('context', 'ask-more');
    params.set('chatId', crypto.randomUUID());
    navigate(`/build/${step}/literature?${params.toString()}`);
  };

  const onContextSubmit = ({
    id,
    chatId,
    newQuestion,
  }: {
    id: string;
    chatId: string;
    newQuestion: Partial<GenerativeQA>;
  }) => {
    const params = new URLSearchParams(searchParams);
    params.set('chatId', chatId);
    if (newQuestion.question && !Object.keys(curratedQuestions).includes(newQuestion.question)) {
      setCurratedQuestions({
        [newQuestion.question]: (
          <span
            key={`${step}-${selectedBrainRegion?.title ?? ''}-${about}-${subject}`}
            className="text-lg"
          >
            {newQuestion.question}
          </span>
        ),
      });
      updateContext((prev) => ({ ...prev, currentQuestion: newQuestion.question }));
      promptResponseNodesAtomFamily({ id, key: newQuestion.question, result: newQuestion });
    } else {
      updatePromptResponseNode({ id, key: newQuestion.question!, result: newQuestion });
    }

    routeReplace(`${pathname}?${params.toString()}`);
  };

  const onAfterStream = (result: GenerativeQA) => {
    updateResults((QAs) => updateAndMerge(QAs, (item) => item.id === result.id, { extra }));
    updatePromptResponseNode({
      ...promptResponseNode,
      result,
    });
  };

  useEffect(() => {
    setCurratedQuestions(
      buildQuestionsList({
        step,
        densityOrCount,
        about: about!,
        subject: subject!,
        brainRegionTitle: selectedBrainRegion?.title!,
      }) ?? {}
    );
  }, [about, densityOrCount, selectedBrainRegion?.title, step, subject]);

  return (
    <div className="w-full h-full my-2">
      <div className="absolute top-0 z-30 flex items-center justify-center w-10 h-10 bg-white rounded-tl-full rounded-bl-full -left-10">
        <CloseOutlined
          className="text-base cursor-pointer text-primary-8"
          onClick={onDrawerClose}
        />
      </div>
      <div className="px-2 mt-4 mb-2">About</div>
      <div className="px-2 mt-px mb-6 text-3xl font-extrabold text-primary-8">{subject}</div>
      <div className="relative w-full">
        <div
          id="parameter-questions"
          className={classNames(
            'w-full h-full absolute left-0 right-0 transition-[visibility,opacity] duration-300',
            currentSlide === 'results'
              ? 'opacity-0 z-0 ease-out invisible'
              : 'opacity-100 z-10 ease-in visible'
          )}
        >
          <CurratedQuestions {...{ curratedQuestions, onSelectQuestion }} />
        </div>
        <div
          id="question-result"
          className={classNames(
            'w-full h-full absolute left-0 right-0 bg-white transition-[visibility,opacity] duration-300',
            currentSlide === 'results'
              ? 'opacity-100 z-10 ease-in visible'
              : 'opacity-0 z-0 ease-out invisible'
          )}
        >
          <BackButton {...{ onSlideBack }} />
          {!promptResponseNode.result?.isNotFound && promptResponseNode.result?.streamed ? (
            <div className="my-4">
              <ItemTile
                index={currentQuestionIndex}
                question={currentQuestionElement}
                selectable={false}
              />
            </div>
          ) : (
            <div className="bg-white p-4 my-4 w-full left-0 right-0 z-50 rounded-2xl border border-zinc-100 flex-col justify-start items-start gap-2.5 inline-flex mx-auto">
              <div className="inline-flex flex-col items-start justify-start w-full px-2 py-3">
                <QAForm
                  key={promptResponseNode.key}
                  label={String(currentQuestionIndex)}
                  onExternalSubmit={onContextSubmit}
                />
              </div>
            </div>
          )}
          {promptResponseNode.id && (
            <div
              className="flex flex-col items-center justify-start w-full h-full min-h-[300px] mb-24 px-4"
              ref={streamRef}
            >
              {withStreamResult({
                onAfterStream,
                scoped: true,
                id: promptResponseNode.id,
                current: omit(promptResponseNode.result, ['id']) as ResultWithoutId,
              })}
            </div>
          )}
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 py-8 z-50 inline-flex items-center justify-center w-full mx-auto gap-x-3 rounded-bl-2xl bg-white">
        {promptResponseNode.result && (
          <RedirectionButton title="More options" onClick={gotoOptionMode} />
        )}
        <RedirectionButton title="Ask more questions" onClick={gotoAskMoreMode} />
      </div>
    </div>
  );
}

// impo! use the key (randomly generated on each attempt to open the drawer)
// this will re-initialize the state to the defaut values
// no need to useEffect to reset in first render

function ContextualLiterature() {
  const { key: contextualKey } = useAtomValue(contextualLiteratureAtom);
  return (
    <ContextualContainer>
      <ContextualContent key={contextualKey} />
    </ContextualContainer>
  );
}

export default ContextualLiterature;
