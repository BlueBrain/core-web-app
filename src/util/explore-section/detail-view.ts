import { Dispatch, SetStateAction } from 'react';
import { from64 } from '@/util/common';
import { FetchParams } from '@/types/explore-section';

/**
 * Returns a FetchParams object that it constructs from a URL path.
 * Used to set the infoAtom used by the Explore section's detail views.
 * @param {string} path - A URL path.
 * @param revision
 * @param {Dispatch<SetStateAction<FetchParams>>} callback - The Atom setter.
 *
 */
// eslint-disable-next-line import/prefer-default-export
export function setInfoWithPath(
  path: string | null | undefined,
  callback: Dispatch<SetStateAction<FetchParams>>,
  revision?: string | null
) {
  if (path) {
    const parts = path.split('/');
    const key = from64(parts[parts.length - 1]);
    const data = key.split('!/!');
    const id = data[data.length - 1];
    const [org, project] = data[0].split('/');
    const info = {
      id,
      org,
      project,
      rev: revision,
    };

    callback(info);
  }
}
