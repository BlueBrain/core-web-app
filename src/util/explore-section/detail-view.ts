import { from64 } from '@/util/common';
import { FetchParams } from '@/types/explore-section/application';

/**
 * Returns a FetchParams object that it constructs from a URL path.
 * Used to set the infoAtom used by the Explore section's detail views.
 * @param {string} path - A URL path.
 * @param revision
 *
 */
export function pathToResource(
  path: string | null | undefined,
  revision?: string | null
): FetchParams | undefined {
  if (path) {
    const parts = path.split('/');

    const key = from64(parts[parts.length - 1]);

    const data = key.split('!/!');

    const id = data[data.length - 1];

    const [org, project] = data[0].split('/'); // TODO: Why data[0], not data[1]?

    return {
      id,
      org,
      project,
      rev: revision ? Number.parseInt(revision, 10) : undefined,
    };
  }
  return undefined;
}
