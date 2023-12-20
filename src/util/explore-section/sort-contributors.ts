import intersection from 'lodash/intersection';

import { localCompareString } from '@/util/common';
import { ensureArray } from '@/util/nexus';
import { IdLabel } from '@/types/explore-section/fields';

export type IdLabelWithType = IdLabel<{ type?: string[] | null }>;

const SCHEMA_TYPE_ORGANIZATION = ['http://schema.org/Organization', 'Organization'];
const SCHEMA_TYPE_PERSON = ['http://schema.org/Person', 'Person'];

/**
 * compare two contributors label using localCompare
 * @param a Contributor
 * @param b Contributor
 * @returns number
 */
function sortContributors<T extends { label?: string }>(a: T, b: T): number {
  return localCompareString(a.label ?? '', b.label ?? '');
}

/**
 * Takes array of contributor Delta resources and returns an array of names sort alphabetically
 * starting by organization, then persons
 * @param contributors Array<Contributor>
 * @param formatter Function
 */
export function normalizeContributors<T>(
  contributors: Array<T>,
  formatter: (t: T) => IdLabelWithType
) {
  const { organizations, people } = ensureArray(contributors)
    .map((contributor) => formatter(contributor))
    .reduce<{
      organizations: Array<IdLabelWithType>;
      people: Array<IdLabelWithType>;
    }>(
      (accumulator, contributor) => {
        if (intersection(contributor.type, SCHEMA_TYPE_ORGANIZATION).length)
          accumulator.organizations.push(contributor);
        if (intersection(contributor.type, SCHEMA_TYPE_PERSON).length)
          accumulator.people.push(contributor);
        return accumulator;
      },
      {
        organizations: [],
        people: [],
      }
    );

  return [...organizations.sort(sortContributors), ...people.sort(sortContributors)].filter(
    (contributor) => !!contributor.label
  );
}
