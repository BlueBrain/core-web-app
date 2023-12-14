'use client';

import { Button, ConfigProvider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { memo, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import AutoCompleteSearch from './AutoCompleteSearch';
import { DateRange } from '@/components/Filter';
import { classNames, normalizeString } from '@/util/utils';
import { Suggestion } from '@/types/literature';
import {
  fetchAuthorSuggestions,
  fetchJournalSuggestions,
  getArticleTypeOptions,
  getAuthorOptions,
  getJournalOptions,
} from '@/components/explore-section/Literature/api';

import {
  initialParameters,
  questionsParametersAtom,
  useQuestionParameter,
} from '@/state/literature';
import {
  articleTypeSuggestionsAtom,
  initialAuthorSuggestionsAtom,
  initialJournalSuggestionsAtom,
} from '@/state/explore-section/literature-filters';

type Props = {
  isParametersVisible: boolean;
  setIsParametersVisible: () => void;
};

function QuestionParameters({ isParametersVisible, setIsParametersVisible }: Props) {
  const update = useQuestionParameter();

  const articleTypesResponse = useAtomValue(useMemo(() => unwrap(articleTypeSuggestionsAtom), []));
  const articleTypes = articleTypesResponse ? getArticleTypeOptions(articleTypesResponse) : [];

  const initialAuthorSuggestions = useAtomValue(
    useMemo(() => unwrap(initialAuthorSuggestionsAtom), [])
  );
  const initialJournalSuggestions = useAtomValue(
    useMemo(() => unwrap(initialJournalSuggestionsAtom), [])
  );

  const currentParameters = useAtomValue(questionsParametersAtom);

  const fetchAuthors = useCallback(
    (searchTerm: string, signal?: AbortSignal) =>
      fetchAuthorSuggestions(searchTerm, signal).then((authors) => getAuthorOptions(authors)),
    []
  );
  const fetchJournals = useCallback(
    (searchTerm: string, signal?: AbortSignal) =>
      fetchJournalSuggestions(searchTerm, signal).then((journalResponse) =>
        getJournalOptions(journalResponse)
      ),
    []
  );

  if (!isParametersVisible) return null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#E8F7FF',
          colorFillQuaternary: '#91D5FF',
          colorFillSecondary: '#91D5FF',
          colorTextPlaceholder: '#40A9FF',
        },
      }}
    >
      <div className={classNames('relative w-fill', isParametersVisible ? 'block' : 'hidden')}>
        <Button
          icon={<CloseOutlined />}
          onClick={setIsParametersVisible}
          shape="circle"
          aria-label="close-parameters"
          className="absolute bg-transparent border-none shadow-none text-primary-8 right-4 -top-6"
        />
        <div className="w-full mt-10">
          <DateRange
            onChange={(e) => update('selectedDate', e)}
            filter={{
              field: 'publicationDate',
              type: 'dateRange',
              aggregationType: 'buckets',
              value: currentParameters.selectedDate
                ? { ...currentParameters.selectedDate }
                : { ...initialParameters.selectedDate },
            }}
          />
          <hr className="my-4 border-primary-2" />
        </div>

        <div className="w-full">
          <AutoCompleteSearch
            key="Journal"
            title="Journal"
            defaultValues={currentParameters.selectedJournals}
            initialSuggestions={initialJournalSuggestions}
            fetchOptions={fetchJournals}
            onChange={(selectedValues: Suggestion[]) => {
              update('selectedJournals', [...selectedValues]);
            }}
          />
          <hr className="my-4 border-primary-2" />
        </div>

        <div className="w-full">
          <AutoCompleteSearch
            key="Authors"
            title="Authors"
            defaultValues={currentParameters.selectedAuthors?.map((a) => ({
              label: a,
              key: a,
              value: a,
            }))}
            fetchOptions={fetchAuthors}
            initialSuggestions={initialAuthorSuggestions}
            onChange={(selectedValues: Suggestion[]) =>
              update(
                'selectedAuthors',
                selectedValues.map((v) => v.value)
              )
            }
          />
          <hr className="my-4 border-primary-2" />
        </div>

        <div className="w-full">
          <AutoCompleteSearch
            key="ArticleTypes"
            title="Article Types"
            defaultValues={currentParameters.selectedArticleTypes?.map((a) => ({
              label: a,
              key: a,
              value: a,
            }))}
            initialSuggestions={articleTypes}
            fetchOptions={async (searchTerm: string) =>
              (articleTypes ?? []).filter((articleTypeOption) =>
                normalizeString(articleTypeOption.value).includes(normalizeString(searchTerm))
              )
            }
            onChange={(selectedValues: Suggestion[]) =>
              update(
                'selectedArticleTypes',
                selectedValues.map((v) => v.value)
              )
            }
          />
          <hr className="my-4 border-primary-2" />
        </div>
      </div>
    </ConfigProvider>
  );
}

// eslint-disable-next-line react/display-name
export default memo(({ isParametersVisible, setIsParametersVisible }: Props) => (
  <QuestionParameters
    isParametersVisible={isParametersVisible}
    setIsParametersVisible={setIsParametersVisible}
  />
));
