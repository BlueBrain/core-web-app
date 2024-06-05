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
      className="group w-max border border-gray-400 bg-white px-5 py-3 hover:bg-primary-8"
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
      className="inline-flex items-center rounded-md px-4 py-3 hover:bg-gray-50"
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
    <div className="flex w-full flex-col items-center justify-center gap-y-2 px-2">
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
        className="[&>.ant-drawer-wrapper-body>.ant-drawer-body]:!primary-scrollbar rounded-bl-2xl py-3 [&>.ant-drawer-wrapper-body]:flex [&>.ant-drawer-wrapper-body]:!h-[calc(100%-100px)] [&>.ant-drawer-wrapper-body]:flex-col-reverse"
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
    <div className="my-2 h-full w-full">
      <div className="absolute -left-10 top-0 z-30 flex h-10 w-10 items-center justify-center rounded-bl-full rounded-tl-full bg-white">
        <CloseOutlined
          className="cursor-pointer text-base text-primary-8"
          onClick={onDrawerClose}
        />
      </div>
      <div className="mb-2 mt-4 px-2">About</div>
      <div className="mb-6 mt-px px-2 text-3xl font-extrabold text-primary-8">{subject}</div>
      <div className="relative w-full">
        <div
          id="parameter-questions"
          className={classNames(
            'absolute left-0 right-0 h-full w-full transition-[visibility,opacity] duration-300',
            currentSlide === 'results'
              ? 'invisible z-0 opacity-0 ease-out'
              : 'visible z-10 opacity-100 ease-in'
          )}
        >
          <CurratedQuestions {...{ curratedQuestions, onSelectQuestion }} />
        </div>
        <div
          id="question-result"
          className={classNames(
            'absolute left-0 right-0 h-full w-full bg-white transition-[visibility,opacity] duration-300',
            currentSlide === 'results'
              ? 'visible z-10 opacity-100 ease-in'
              : 'invisible z-0 opacity-0 ease-out'
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
            <div className="left-0 right-0 z-50 mx-auto my-4 inline-flex w-full flex-col items-start justify-start gap-2.5 rounded-2xl border border-zinc-100 bg-white p-4">
              <div className="inline-flex w-full flex-col items-start justify-start px-2 py-3">
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
              className="mb-24 flex h-full min-h-[300px] w-full flex-col items-center justify-start px-4"
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
      <div className="absolute bottom-0 left-0 right-0 z-50 mx-auto inline-flex w-full items-center justify-center gap-x-3 rounded-bl-2xl bg-white py-8">
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
