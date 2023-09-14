'use client';

import { Button, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useAtomValue } from 'jotai';

import { useEffect, useState } from 'react';
import { loadable } from 'jotai/utils';
import useChatQAContext, { ChatQAContextHook, initialParameters } from '../useChatQAContext';
import useContextualLiteratureContext from '../useContextualLiteratureContext';
import AutoCompleteSearch from './AutoCompleteSearch';
import { DateRange } from '@/components/Filter';
import { classNames, normalizeString } from '@/util/utils';
import sessionAtom from '@/state/session';
import {
  AuthorSuggestionResponse,
  JournalSuggestionResponse,
  Suggestion,
} from '@/types/literature';
import { articleTypeSuggestionsAtom } from '@/state/literature';
import {
  fetchAuthorSuggestions,
  fetchJournalSuggestions,
} from '@/components/explore-section/Literature/api';

type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  type: 'submit' | 'button';
};

const REFINE_SEARCH_HELP_TEXT = `Before launching the search related to your question,
 use these parameters to obtain a more 
 specific answer.`;

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

export function GenerativeQAForm({
  query,
  isParametersVisible,
  isPending,
  onValueChange,
  onQuestionClear,
  ask,
  children,
  label,
}: Omit<Partial<ChatQAContextHook>, 'ask'> & {
  ask: (data: FormData) => void;
  children?: React.ReactNode;
  label?: string;
}) {
  return (
    <form name="qa-form" className="w-full" action={ask}>
      {label && (
        <label htmlFor="gqa-question" className="mb-8 text-base text-slate-400">
          {label}
        </label>
      )}
      <div className="pb-1.5 border-b border-sky-400 justify-between items-center gap-2.5 inline-flex w-full">
        <input
          type="text"
          id="gqa-question"
          name="gqa-question"
          autoComplete="off"
          value={query}
          onChange={onValueChange}
          placeholder="Send your question"
          className="block w-full text-base font-semibold bg-transparent outline-none text-primary-8 placeholder:text-blue-900 placeholder:text-base placeholder:font-normal placeholder:leading-snug focus:shadow-none"
        />
        <div className="inline-flex items-center justify-center gap-2">
          {(isPending || (query && !!query.length)) && (
            <FormButton
              type="button"
              icon={
                isPending ? (
                  <LoadingOutlined className="text-base text-primary-8" />
                ) : (
                  query &&
                  !!query.length && <CloseCircleOutlined className="text-base text-primary-8" />
                )
              }
              onClick={onQuestionClear}
            />
          )}
          {!isParametersVisible && (
            <FormButton
              type="submit"
              icon={<SendOutlined className="text-base -rotate-[30deg] text-primary-8" />}
            />
          )}
        </div>
      </div>
      {children}
    </form>
  );
}

const loadableArticleTypes = loadable(articleTypeSuggestionsAtom);

function GenerativeQABar() {
  const { dataSource, isContextualLiterature, isBuildSection } = useContextualLiteratureContext();
  const session = useAtomValue(sessionAtom);
  const [articleTypes, setArticleTypes] = useState<Suggestion[]>([]);
  const articleTypesStatus = useAtomValue(loadableArticleTypes);
  const isChatBarMustSlideInDown = Boolean(dataSource.length);
  const {
    query,
    ask,
    isPending,
    onValueChange,
    onQuestionClear,
    isParametersVisible,
    updateParameters,
    setIsParametersVisible,
    isQuestionEmpty,
  } = useChatQAContext({
    saveOnContext: isContextualLiterature,
  });

  useEffect(() => {
    if (articleTypesStatus.state === 'loading' || articleTypesStatus.state === 'hasError') {
      setArticleTypes([]);
    } else {
      setArticleTypes(
        articleTypesStatus.data.map((type) => ({
          key: type.articleType,
          label: type.articleType,
          value: type.articleType,
        }))
      );
    }
  }, [articleTypesStatus]);

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
          'bg-white p-4 w-full left-0 right-0 z-50 rounded-2xl border border-zinc-100 flex-col justify-start items-start gap-2.5 inline-flex max-w-4xl mx-auto right-4',
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
          <GenerativeQAForm
            ask={ask()}
            {...{
              isPending,
              query,
              onValueChange,
              onQuestionClear,
              isParametersVisible,
              updateParameters,
            }}
          >
            <>
              {!isParametersVisible && (
                <div className="flex items-center justify-end w-full mt-4">
                  <span className="text-primary-8">Refine your search</span>
                  <Tooltip
                    title={REFINE_SEARCH_HELP_TEXT}
                    color="#003A8C"
                    overlayInnerStyle={{ background: '#003A8C' }}
                  >
                    <InfoCircleOutlined className="mx-2 text-primary-5" />
                  </Tooltip>
                  <Button
                    onClick={() => setIsParametersVisible(true)}
                    className="border rounded-none border-primary-4 text-primary-8 bg-primary-0"
                  >
                    Parameters
                  </Button>
                </div>
              )}
              {isParametersVisible && (
                <div className="w-full relative">
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => setIsParametersVisible(false)}
                    shape="circle"
                    aria-label="close-parameters"
                    className="bg-transparent border-none text-primary-8 shadow-none absolute right-4 -top-6"
                  />
                  <div className="w-full mt-10">
                    <DateRange
                      onChange={(e) => updateParameters({ selectedDate: e })}
                      filter={{
                        field: 'publicationDate',
                        type: 'dateRange',
                        aggregationType: 'buckets',
                        value: { ...initialParameters.selectedDate },
                      }}
                    />
                    <hr className="my-4 border-primary-2" />
                  </div>

                  <div className="w-full">
                    <AutoCompleteSearch
                      title="Journal"
                      fetchOptions={(searchTerm: string) =>
                        fetchJournalSuggestions(searchTerm, session!.accessToken).then(
                          (journalResponse) => getJournalOptions(journalResponse)
                        )
                      }
                      onChange={(selectedValues: Suggestion[]) => {
                        const selectedJournals = selectedValues.map((option) => option.key);
                        updateParameters({ selectedJournals });
                      }}
                    />
                    <hr className="my-4 border-primary-2" />
                  </div>

                  <div className="w-full">
                    <AutoCompleteSearch
                      title="Authors"
                      fetchOptions={(searchTerm: string) =>
                        fetchAuthorSuggestions(searchTerm, session!.accessToken).then((authors) =>
                          getAuthorOptions(authors)
                        )
                      }
                      onChange={(selectedValues: Suggestion[]) =>
                        updateParameters({ selectedAuthors: selectedValues.map((v) => v.value) })
                      }
                    />
                    <hr className="my-4 border-primary-2" />
                  </div>

                  <div className="w-full">
                    <AutoCompleteSearch
                      title="Article Types"
                      fetchOptions={async (searchTerm: string) =>
                        articleTypes.filter((articleTypeOption) =>
                          normalizeString(articleTypeOption.value).includes(
                            normalizeString(searchTerm)
                          )
                        )
                      }
                      onChange={(selectedValues: Suggestion[]) =>
                        updateParameters({
                          selectedArticleTypes: selectedValues.map((v) => v.value),
                        })
                      }
                    />
                    <hr className="my-4 border-primary-2" />
                  </div>
                </div>
              )}
              {isParametersVisible && (
                <div className="flex justify-end w-full mb-4">
                  <button
                    type="submit"
                    disabled={isQuestionEmpty || isPending}
                    title={isQuestionEmpty ? 'Please enter a question' : ''}
                    className="border-[1px] border-solid border-gray rounded px-4 py-2 text-primary-8 disabled:text-gray-400"
                  >
                    Search <SendOutlined className="text-base -rotate-[30deg] ml-1" />
                  </button>
                </div>
              )}
            </>
          </GenerativeQAForm>
        </div>
      </div>
    </div>
  );
}

export default GenerativeQABar;

const getAuthorOptions = (mlResponse: AuthorSuggestionResponse) =>
  mlResponse.map(
    (authorResponse) =>
      ({
        key: authorResponse.name,
        label: authorResponse.name,
        value: authorResponse.name,
      } as Suggestion)
  );

const getJournalOptions = (mlResponse: JournalSuggestionResponse) =>
  mlResponse.map((journalResponse, index) => ({
    key: journalResponse.eissn ?? journalResponse.print_issn ?? `${index}`,
    label: journalResponse.title,
    value: journalResponse.title,
  }));
