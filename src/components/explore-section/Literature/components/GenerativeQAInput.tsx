'use client';

import { useReducer, useState, useTransition } from 'react';
import { useAtomValue } from 'jotai';
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import merge from 'lodash/merge';

import { Button, Tooltip } from 'antd';
import { generativeQADTO } from '../utils/DTOs';
import { getGenerativeQAAction } from '../actions';
import { LiteratureValidationError } from '../errors';
import JournalSearch from './JournalSearch';
import {
  GenerativeQA,
  GenerativeQAServerResponse,
  GenerativeQAWithDataResponse,
  isGenerativeQA,
  isGenerativeQANoFound,
} from '@/types/literature';
import { classNames, formatDate } from '@/util/utils';
import { literatureAtom, useLiteratureAtom, useLiteratureResultsAtom } from '@/state/literature';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import usePathname from '@/hooks/pathname';
import { DateRange } from '@/components/Filter';
import { GteLteValue } from '@/components/Filter/types';

type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  type: 'submit' | 'button';
};

type QuestionParameters = {
  selectedDate: GteLteValue;
  selectedJournals: string[];
};

function FormButton({ icon, type, ...props }: FormButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={type === 'submit' ? 'submit' : 'button'}
      className="text-sm font-medium text-white rounded-lg outline-none focus-within:shadow-none"
    >
      {icon}
    </button>
  );
}

const initialParameters: QuestionParameters = {
  selectedDate: { lte: null, gte: null },
  selectedJournals: [],
};

const REFINE_SEARCH_HELP_TEXT = `Before launching the search related to your question,
 use these parameters to obtain a more 
 specific answer.`;

function GenerativeQAInputBar() {
  const update = useLiteratureAtom();
  const { query } = useAtomValue(literatureAtom);
  const { update: updateResults, QAs } = useLiteratureResultsAtom();
  const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const [isGQAPending, startGenerativeQATransition] = useTransition();
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');

  const [parametersVisible, setParametersVisible] = useState(false);
  const [{ selectedDate, selectedJournals }, updateParameters] = useReducer(
    (previous: QuestionParameters, next: Partial<QuestionParameters>) => ({ ...previous, ...next }),
    { ...initialParameters }
  );

  const isChatBarMustSlideInDown = Boolean(QAs.length);
  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    update('query', value);
  const onQuestionClear = () => update('query', '');
  const onGenerativeQAFinished = (
    data: GenerativeQAServerResponse | LiteratureValidationError | null
  ) => {
    if (data && !(data instanceof LiteratureValidationError)) {
      let newGenerativeQA: GenerativeQA = generativeQADTO({
        question: data.question,
        isNotFound: isGenerativeQANoFound(data) || !isGenerativeQA(data),
        response: isGenerativeQA(data)
          ? (data.response as GenerativeQAWithDataResponse)
          : undefined,
      });
      if (selectedBrainRegion?.id) {
        newGenerativeQA = merge(newGenerativeQA, {
          brainRegion: {
            id: selectedBrainRegion.id,
            title: selectedBrainRegion.title,
          },
        });
      }
      update('activeQuestionId', newGenerativeQA.id);
      updateResults(newGenerativeQA);
    }
    update('query', '');
    updateParameters({ ...initialParameters });
    setParametersVisible(false);
  };

  const isQuestionEmpty = query.trim().length === 0;

  return (
    <div
      className={classNames(
        ' flex flex-col items-center justify-center w-full pr-4',
        !isChatBarMustSlideInDown && !isBuildSection && 'fixed top-1/2 -translate-y-1/2',
        isBuildSection && !isChatBarMustSlideInDown && 'absolute top-1/2 -translate-y-1/2',
        isChatBarMustSlideInDown && 'absolute bottom-0 left-0 right-0'
      )}
    >
      <form
        name="qa-form"
        className={classNames(
          'bg-white p-4 w-full left-0 right-0 z-50 rounded-2xl border border-zinc-100 flex-col justify-start items-start gap-2.5 inline-flex max-w-4xl mx-auto',
          isChatBarMustSlideInDown
            ? 'transition-all duration-300 ease-out-expo rounded-b-none pb-0'
            : ''
        )}
        action={(data: FormData) => {
          startGenerativeQATransition(async () => {
            const result = await getGenerativeQAAction({
              data,
              keywords: selectedBrainRegion ? [selectedBrainRegion.title] : undefined,
              journals: selectedJournals,
              fromDate: selectedDate.gte
                ? formatDate(selectedDate.gte as Date, 'yyyy-MM-dd')
                : undefined,
              endDate: selectedDate.lte
                ? formatDate(selectedDate.lte as Date, 'yyyy-MM-dd')
                : undefined,
            });
            onGenerativeQAFinished(result);
          });
        }}
      >
        <div
          className={classNames(
            'inline-flex flex-col items-start justify-start w-full px-6 py-8  bg-primary-0',
            isChatBarMustSlideInDown ? 'rounded-b-none' : 'rounded-lg'
          )}
        >
          <div className="pb-1.5 border-b border-sky-400 justify-between items-center gap-2.5 inline-flex w-full">
            <input
              type="text"
              id="gqa-question"
              name="gqa-question"
              autoComplete="off"
              className="block w-full text-base font-semibold bg-transparent outline-none text-primary-8 placeholder:text-blue-900 placeholder:text-base placeholder:font-normal placeholder:leading-snug focus:shadow-none"
              placeholder="Send your question"
              onChange={onChange}
              value={query}
            />
            <div className="inline-flex items-center justify-center gap-2">
              {(isGQAPending || !!query.length) && (
                <FormButton
                  type="button"
                  icon={
                    isGQAPending ? (
                      <LoadingOutlined className="text-base text-primary-8" />
                    ) : (
                      !!query.length && <CloseCircleOutlined className="text-base text-primary-8" />
                    )
                  }
                  onClick={onQuestionClear}
                />
              )}
              {!parametersVisible && (
                <FormButton
                  type="submit"
                  icon={<SendOutlined className="text-base -rotate-[30deg] text-primary-8" />}
                />
              )}
            </div>
          </div>
          {!parametersVisible && (
            <div className="flex justify-end w-full items-center mt-4">
              <span className="text-primary-8">Refine your search</span>
              <Tooltip
                title={REFINE_SEARCH_HELP_TEXT}
                color="#003A8C"
                overlayInnerStyle={{ background: '#003A8C' }}
              >
                <InfoCircleOutlined className="text-primary-5 mx-2" />
              </Tooltip>
              <Button
                onClick={() => setParametersVisible(true)}
                className="border border-primary-4 text-primary-8 rounded-none bg-primary-0"
              >
                Parameters
              </Button>
            </div>
          )}

          {parametersVisible && (
            <div className="w-full">
              <div className="mt-10 w-full">
                <DateRange
                  onChange={(e) => updateParameters({ selectedDate: e })}
                  filter={{
                    field: 'publicationDate',
                    type: 'dateRange',
                    aggregationType: 'buckets',
                    value: { ...initialParameters.selectedDate },
                  }}
                />
                <hr className="border-primary-2 my-4" />
              </div>

              <div className="w-full">
                <JournalSearch
                  onChange={(newValues) => updateParameters({ selectedJournals: newValues })}
                />
                <hr className="border-primary-2 my-4" />
              </div>
            </div>
          )}
        </div>

        {parametersVisible && (
          <div className="w-full flex justify-end mb-4">
            <button
              type="submit"
              disabled={isQuestionEmpty}
              title={isQuestionEmpty ? 'Please enter a question' : ''}
              className={classNames(
                'border-[1px ] border-solid border-gray rounded px-4 py-2',
                isQuestionEmpty ? 'text-gray-400' : 'text-primary-8'
              )}
            >
              Search <SendOutlined className="text-base -rotate-[30deg] ml-1" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default GenerativeQAInputBar;
