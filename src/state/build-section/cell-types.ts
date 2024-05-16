import { selectAtom } from 'jotai/utils';
import esb from 'elastic-builder';
import { Session } from 'next-auth';
import sessionAtom from '@/state/session';
import { createHeaders } from '@/util/utils';
import { ClassNexus } from '@/api/ontologies/types';
import { ATLAS_SEARCH_URL } from '@/constants/build-section';
import { ETYPE_NEXUS_TYPE, MTYPE_NEXUS_TYPE } from '@/constants/ontologies';

type ClassESResponse = {
  _source: ClassNexus;
};

// Returns cell types metadata
export const cellTypesAtom = selectAtom<Session | null, Promise<any> | null>(
  sessionAtom,
  (session) => {
    if (!session) return null;

    const query = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .must(esb.termQuery('@type', 'Class'))
          .must(esb.termQuery('_deprecated', false))
          .must(esb.termsQuery('subClassOf', [MTYPE_NEXUS_TYPE, ETYPE_NEXUS_TYPE]))
      )
      .size(10000);

    return fetch(ATLAS_SEARCH_URL, {
      method: 'POST',
      headers: createHeaders(session.accessToken),
      body: JSON.stringify(query.toJSON()),
    }).then((res) => res.json());
  }
);

// Returns cell types metadata in key => value format where key = id of cell type
export const cellTypesByIdAtom = selectAtom<
  Promise<any> | null,
  Promise<Record<string, ClassNexus> | undefined> | null
>(cellTypesAtom, (cellTypes) => {
  if (!cellTypes || !cellTypes.hits) return null;
  return cellTypes.hits.hits.reduce(
    (acc: Record<string, ClassNexus>, classObj: ClassESResponse) => {
      acc[classObj._source['@id']] = classObj._source;
      return acc;
    },
    {}
  );
});

// Returns cell types metadata in key => value format where key = label of cell type
export const cellTypesByLabelAtom = selectAtom<
  Promise<any> | null,
  Promise<Record<string, ClassNexus> | undefined> | null
>(cellTypesAtom, (cellTypes) => {
  if (!cellTypes || !cellTypes.hits) return null;

  return cellTypes.hits.hits.reduce(
    (acc: Record<string, ClassNexus>, classObj: ClassESResponse) => {
      acc[classObj._source.label] = classObj._source;
      return acc;
    },
    {}
  );
});
