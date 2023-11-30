'use client';

import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import AutoCompleteSearch from './AutoCompleteSearch';
import { DateRange } from '@/components/Filter';
import { normalizeString } from '@/util/utils';
import {
  AuthorSuggestionResponse,
  JournalSuggestionResponse,
  Suggestion,
} from '@/types/literature';
import {
  fetchAuthorSuggestions,
  fetchJournalSuggestions,
} from '@/components/explore-section/Literature/api';

import {
  articleTypeSuggestionsAtom,
  initialParameters,
  questionsParametersAtom,
  useQuestionParameter,
} from '@/state/literature';

type Props = {
  isParametersVisible: boolean;
  setIsParametersVisible: (value: boolean) => void;
};

function QuestionParameters({ isParametersVisible, setIsParametersVisible }: Props) {
  const update = useQuestionParameter();
  const articleTypes = useAtomValue(useMemo(() => unwrap(articleTypeSuggestionsAtom), []));
  const currentParameters = useAtomValue(questionsParametersAtom);

  return (
    isParametersVisible && (
      <div className="relative w-full">
        <Button
          icon={<CloseOutlined />}
          onClick={() => setIsParametersVisible(false)}
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
            fetchOptions={(searchTerm: string, signal?: AbortSignal) =>
              fetchJournalSuggestions(searchTerm, signal).then((journalResponse) =>
                getJournalOptions(journalResponse)
              )
            }
            onChange={(selectedValues: Suggestion[]) => {
              const selectedJournals = selectedValues.map((option) => option.key);
              update('selectedJournals', selectedJournals);
            }}
            selectedValues={currentParameters.selectedJournals}
          />
          <hr className="my-4 border-primary-2" />
        </div>

        <div className="w-full">
          <AutoCompleteSearch
            key="Authors"
            title="Authors"
            fetchOptions={(searchTerm: string, signal?: AbortSignal) =>
              fetchAuthorSuggestions(searchTerm, signal).then((authors) =>
                getAuthorOptions(authors)
              )
            }
            onChange={(selectedValues: Suggestion[]) =>
              update(
                'selectedAuthors',
                selectedValues.map((v) => v.value)
              )
            }
            selectedValues={currentParameters.selectedAuthors}
          />
          <hr className="my-4 border-primary-2" />
        </div>

        <div className="w-full">
          <AutoCompleteSearch
            key="ArticleTypes"
            title="Article Types"
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
            selectedValues={currentParameters.selectedArticleTypes}
          />
          <hr className="my-4 border-primary-2" />
        </div>
      </div>
    )
  );
}

// eslint-disable-next-line react/display-name
export default memo(({ isParametersVisible, setIsParametersVisible }: Props) => (
  <QuestionParameters
    isParametersVisible={isParametersVisible}
    setIsParametersVisible={setIsParametersVisible}
  />
));

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
