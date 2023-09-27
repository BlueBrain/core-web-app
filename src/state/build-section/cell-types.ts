import { selectAtom } from 'jotai/utils';
import esb from 'elastic-builder';
import sessionAtom from '@/state/session';
import { createHeaders } from '@/util/utils';
import { ClassNexus } from '@/api/ontologies/types';
import { ATLAS_SEARCH } from '@/constants/build-section';

type ClassESResponse = {
  _source: ClassNexus;
};

export const cellTypesAtom = selectAtom(sessionAtom, (session) => {
  const query = esb
    .requestBodySearch()
    .query(
      esb
        .boolQuery()
        .must(esb.termQuery('@type', 'Class'))
        .must(esb.termQuery('_deprecated', false))
        .must(
          esb.termsQuery('subClassOf', [
            'https://neuroshapes.org/MType',
            'https://neuroshapes.org/EType',
          ])
        )
    )
    .size(10000);

  if (!session) return null;
  return fetch(ATLAS_SEARCH, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(query.toJSON()),
  })
    .then((res) => res.json())
    .then((data) =>
      data.hits.hits.reduce((acc: Record<string, ClassNexus>, classObj: ClassESResponse) => {
        acc[classObj._source['@id']] = classObj._source;
        return acc;
      }, {})
    );
});
