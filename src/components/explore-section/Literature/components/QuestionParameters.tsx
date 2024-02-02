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
import { FilterTypeEnum } from '@/types/explore-section/filters';

type Props = {
  areQAParamsVisible: boolean;
  closeQAParams: () => void;
};

function QuestionParameters({ areQAParamsVisible, closeQAParams }: Props) {
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

  if (!areQAParamsVisible) return null;

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
      <div
        className={classNames(
          'w-fill relative mb-6 rounded-lg bg-primary-0 px-7',
          areQAParamsVisible ? 'block' : 'hidden'
        )}
      >
        <Button
          icon={<CloseOutlined />}
          onClick={closeQAParams}
          shape="circle"
          aria-label="close-parameters"
          className="absolute right-4 top-2 mr-3 border-none bg-transparent text-primary-8 shadow-none"
        />
        <div className="mt-8 w-full">
          <DateRange
            onChange={(e) => update('selectedDate', e)}
            filter={{
              field: 'publicationDate',
              type: FilterTypeEnum.DateRange,
              aggregationType: 'buckets',
              value: currentParameters.selectedDate
                ? { ...currentParameters.selectedDate }
                : { ...initialParameters.selectedDate },
            }}
          />
          <hr className="my-3 border-primary-2" />
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
          <hr className="my-3 border-primary-2" />
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
          <hr className="my-3 border-primary-2" />
        </div>

        <div className="mb-3 w-full">
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
        </div>
      </div>
    </ConfigProvider>
  );
}

// eslint-disable-next-line react/display-name
export default memo(({ areQAParamsVisible, closeQAParams: setAreQAParamsVisible }: Props) => (
  <QuestionParameters
    areQAParamsVisible={areQAParamsVisible}
    closeQAParams={setAreQAParamsVisible}
  />
));
