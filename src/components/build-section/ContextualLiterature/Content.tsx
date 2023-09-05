'use client';

import { useEffect, useMemo, useState } from 'react';
import { Drawer, Skeleton } from 'antd';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import kebabCase from 'lodash/kebabCase';
import find from 'lodash/find';

import ItemTile from './ItemTile';
import { buildQuestionsList, destructPath } from './util';
import { GenerativeQASingleResultCompact } from '@/components/explore-section/Literature/components/GenerativeQAResults';
import useContextualLiteratureContext from '@/components/explore-section/Literature/useContextualLiteratureContext';
import { GenerativeQAForm } from '@/components/explore-section/Literature/components/GenerativeQAInput';
import useChatQAContext from '@/components/explore-section/Literature/useChatQAContext';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  useContextualLiteratureAtom,
  useContextualLiteratureResultAtom,
  useLiteratureAtom,
  useLiteratureResultsAtom,
} from '@/state/literature';
import { ContextQAItem, GenerativeQA } from '@/types/literature';
import { classNames } from '@/util/utils';
import updateArray from '@/util/updateArray';

function ContextualContent() {
  const { push: navigate } = useRouter();
  const searchParams = useSearchParams()!;
  const updateLiteratureAtom = useLiteratureAtom();
  const densityOrCount = useAtomValue(densityOrCountAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const { context, update } = useContextualLiteratureAtom();
  const [currentSlide, setCurrentSlide] = useState<'questions' | 'results'>('questions');
  const { pathname, clearContextSearchParams } = useContextualLiteratureContext();
  const { reset } = useContextualLiteratureResultAtom();
  const { QAs } = useLiteratureResultsAtom();

  const path = destructPath(pathname!);
  const currentGQA = useMemo(
    () => find(context.contextQuestions, ({ key }) => key === context.currentQuestion?.key),
    [context.contextQuestions, context.currentQuestion]
  );

  const { ask, isPending, query, onValueChange, onQuestionClear } = useChatQAContext({
    resetAfterAsk: true,
    afterAskCallback: (gqa: GenerativeQA) => {
      const item = context.contextQuestions?.find((elt: ContextQAItem) => elt.key === query);
      update('currentQuestion', {
        key: query,
        value: item?.value ?? <span className="text-lg to-primary-8">{query}</span>,
        gqa,
      });
      if (context.contextQuestions) {
        update(
          'contextQuestions',
          (item
            ? updateArray<ContextQAItem>({
                array: context.contextQuestions,
                keyfn: (elt) => elt.key === context.currentQuestion?.key,
                newVal: {
                  ...item,
                  gqa,
                },
              })
            : [
                ...context.contextQuestions,
                {
                  key: query,
                  value: <span className="text-lg to-primary-8">{query}</span>,
                  gqa,
                },
              ]) as ContextQAItem[]
        );
      }
    },
  });

  const onDrawerClose = () => update('contextDrawerOpen', false);
  const onSlideForward = () => setCurrentSlide('results');
  const onSlideBack = () => {
    setCurrentSlide('questions');
    update('currentQuestion', null);
  };

  const onSelectQuestion =
    ({ key, value }: Omit<ContextQAItem, 'gqa'>) =>
    async () => {
      const gqa = find(context.contextQuestions, { key })?.gqa;
      update('currentQuestion', { key, value, gqa });
      updateLiteratureAtom('query', key);
      onSlideForward();
    };

  const prebuiltQuestions = useMemo(() => {
    const questions = buildQuestionsList({
      densityOrCount,
      step: path.step,
      brainRegionTitle: selectedBrainRegion?.title!,
      about: context.about!,
      subject: context.subject!,
    });
    return questions;
  }, [densityOrCount, context.about, context.subject, path.step, selectedBrainRegion?.title]);

  const gotoOptionMode = () => {
    onDrawerClose();
    const clearedParams = clearContextSearchParams(searchParams);
    if (searchParams) {
      const params = new URLSearchParams(clearedParams);
      params.append('context', 'more-options');
      params.append('context-question', context.currentQuestion?.gqa?.id ?? '');
      const link = `/build/${path.step}/literature?${params.toString()}`;
      const question = QAs.find((item) => item.id === context.currentQuestion?.gqa?.id) ?? null;
      if (question) reset(question);
      navigate(link);
    }
  };

  const gotoAskMoreMode = () => {
    reset(null);
    onDrawerClose();
    const clearedParams = clearContextSearchParams(searchParams);
    if (searchParams) {
      const params = new URLSearchParams(clearedParams);
      params.append('context', 'ask-more');
      const link = `/build/${path.step}/literature?${params.toString()}`;
      navigate(link);
    }
  };

  useEffect(() => {
    update(
      'contextQuestions',
      prebuiltQuestions
        ? Object.entries(prebuiltQuestions).map(([key, value]) => ({ key, value }))
        : ([] as ContextQAItem[])
    );
    // TODO: FYI: this part of the code will be updated in the next MR, to remove the tslint comment,
    // TODO: --> in the next MR, I will be using the useSetAtom and added it to the deps array, since this fn is reference safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prebuiltQuestions]);

  useEffect(() => {
    (() => {
      update('currentQuestion', null);
      updateLiteratureAtom('query', '');
      onSlideBack();
    })();
    // TODO: FYI: this part of the code will be updated in the next MR, to remove the tslint comment,
    // TODO: --> in the next MR, I will be using the useSetAtom and added it to the deps array, since this fn is reference safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.about, context.subject, path.step]);

  return (
    <Drawer
      maskClosable
      destroyOnClose
      open={context?.contextDrawerOpen}
      onClose={onDrawerClose}
      mask={false}
      className="contextual-literature rounded-bl-2xl"
      rootClassName="contextual-literature-root"
      title={null}
      closeIcon={null}
      width="40vw"
      rootStyle={{
        margin: '20px 0',
      }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px',
      }}
    >
      <div className="w-full h-full">
        <div className="absolute top-0 z-30 flex items-center justify-center w-10 h-10 bg-white rounded-tl-full rounded-bl-full -left-10">
          <CloseOutlined
            className="text-base cursor-pointer text-primary-8"
            onClick={onDrawerClose}
          />
        </div>
        <div className="px-2 mt-4 mb-2">About</div>
        <div className="px-2 mt-px mb-6 text-3xl font-extrabold text-primary-8">
          {context.subject}
        </div>
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
            <div className="flex flex-col items-center justify-center w-full px-2 gap-y-2">
              {context.contextQuestions &&
                context.contextQuestions.map(({ key, value }, index) => (
                  <ItemTile
                    key={kebabCase(key)}
                    isPending={isPending && context.currentQuestion?.key === key}
                    onSelect={onSelectQuestion({ key, value })}
                    {...{ index: index + 1, question: value }}
                  />
                ))}
            </div>
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
            <button
              type="button"
              onClick={onSlideBack}
              className="inline-flex items-center px-4 py-3 rounded-md hover:bg-gray-50"
            >
              <ArrowLeftOutlined className="mr-2 text-base text-gray-400" />
              <span className="text-base font-normal text-gray-500">Back to all questions</span>
            </button>
            {currentGQA?.gqa?.id && currentGQA.value ? (
              <div className="my-4">
                <ItemTile
                  key={currentGQA.key}
                  index={
                    Number(
                      context.contextQuestions?.findIndex((item) => item.key === currentGQA.key)
                    ) + 1
                  }
                  question={currentGQA.value}
                  selectable={false}
                />
              </div>
            ) : (
              <div
                className={classNames(
                  'bg-white p-4 my-4 w-full left-0 right-0 z-50 rounded-2xl border border-zinc-100 flex-col justify-start items-start gap-2.5 inline-flex mx-auto'
                )}
              >
                <div
                  className={classNames(
                    'inline-flex flex-col items-start justify-start w-full px-2 py-3'
                  )}
                >
                  <GenerativeQAForm
                    ask={ask({
                      parameter: context.about,
                      buildStep: path.step,
                      DensityOrCount: densityOrCount,
                    })}
                    {...{
                      isPending,
                      query,
                      onQuestionClear,
                      onValueChange,
                    }}
                  />
                </div>
              </div>
            )}
            <div
              className={classNames(
                'flex flex-col items-center justify-start w-full h-full min-h-[300px] mb-24'
              )}
            >
              {isPending ? (
                <Skeleton
                  active
                  className="px-2 mt-8"
                  title={{ width: '50%' }}
                  paragraph={{ rows: 5, width: '100%' }}
                />
              ) : (
                <div className="w-full px-4">
                  {currentGQA?.gqa && (
                    <GenerativeQASingleResultCompact
                      key={currentGQA.gqa.id}
                      {...{
                        id: currentGQA.gqa.id,
                        brainRegion: currentGQA.gqa.brainRegion,
                        answer: currentGQA.gqa.answer,
                        rawAnswer: currentGQA.gqa.rawAnswer,
                        question: currentGQA.gqa.question,
                        articles: currentGQA.gqa.articles,
                        askedAt: currentGQA.gqa.askedAt,
                        isNotFound: currentGQA.gqa.isNotFound,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute left-0 right-0 z-50 inline-flex items-center justify-center w-full mx-auto bottom-8 gap-x-3">
          {context.currentQuestion?.gqa?.id && (
            <button
              type="button"
              onClick={gotoOptionMode}
              className="px-5 py-3 bg-white border border-gray-400 w-max hover:bg-primary-8 group"
            >
              <span className="text-base font-bold text-primary-8 group-hover:text-white">
                More options
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={gotoAskMoreMode}
            className="px-5 py-3 bg-white border border-gray-400 w-max hover:bg-primary-8 group"
          >
            <span className="text-base font-bold text-primary-8 group-hover:text-white">
              Ask more questions
            </span>
          </button>
        </div>
      </div>
    </Drawer>
  );
}

export default ContextualContent;
