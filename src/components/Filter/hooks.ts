import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import { Bucket } from './types';

export function useOptions(values: string[], buckets?: Bucket[]) {
  return useMemo(() => {
    // returning unique buckets since some times we have same label and different id (eg. contributors)
    return (
      buckets &&
      uniqBy(buckets, 'key').map((bucket) => {
        const key = String(bucket.key);
        return {
          checked: values?.includes(key),
          id: key,
          count: bucket.doc_count,
          label:
            typeof bucket.label === 'string'
              ? bucket.label
              : String(bucket.label?.buckets[0].key || key),
        };
      })
    );
  }, [buckets, values]);
}
