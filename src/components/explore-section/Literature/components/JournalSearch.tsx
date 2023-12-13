'use client';

import { ConfigProvider, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useMemo, useRef, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';

import { bbsMlBaseUrl } from '@/config';
import { JournalSuggestionResponse } from '@/types/literature';
import sessionAtom from '@/state/session';
import { createHeaders } from '@/util/utils';

type JournalOption = {
  key: string;
  label: string;
  value: string;
};

type Props = {
  onChange: (selectedJournals: string[]) => void;
};

export default function JournalSearch({ onChange }: Props) {
  const [options, setOptions] = useState<JournalOption[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const session = useAtomValue(sessionAtom);

  const fetchRef = useRef(0);

  const debounceFetchOptions = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current = +1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchJournalOptions(value, session!.accessToken).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, 800);
  }, [session]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#E8F7FF',
          colorFillQuaternary: '#91D5FF',
          colorFillSecondary: '#91D5FF',
          colorTextPlaceholder: '#40A9FF',
          colorPrimary: 'white',
        },
      }}
    >
      <Select
        onSearch={debounceFetchOptions}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        placeholder="Journal"
        mode="multiple"
        labelInValue
        filterOption={false}
        options={options}
        allowClear
        onChange={(newValue: JournalOption[]) => {
          const selectedJournals = newValue.map((option) => {
            const journalIssn = option.key;
            // TODO: This transformation will no longer be needed once ML team completes this ticket - https://bbpteam.epfl.ch/project/issues/browse/BBPP115-398
            return journalIssn.slice(0, 4).concat('-').concat(journalIssn.slice(4));
          });
          onChange(selectedJournals);
        }}
        suffixIcon={<DownOutlined className="text-primary-4" />}
        className="min-w-[84px] rounded"
        bordered={false}
        size="middle"
        popupMatchSelectWidth={false}
      />
    </ConfigProvider>
  );
}

const fetchJournalOptions = (searchTerm: string, accessToken: string) => {
  return fetch(`${bbsMlBaseUrl}/journal_suggestion`, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      keywords: [searchTerm],
    }),
  })
    .then((response: any) => response.json())
    .then((mlResponse: JournalSuggestionResponse) =>
      mlResponse.map(
        (journalResponse, index) =>
          ({
            key: journalResponse.eissn ?? journalResponse.print_issn ?? `${index}`,
            label: journalResponse.title,
            value: journalResponse.title,
          } as JournalOption)
      )
    );
};
