import { atom, Atom } from 'jotai';
import sessionAtom from '@/state/session';
import { composeUrl } from '@/util/nexus';
import { fetchFileByUrl } from '@/api/nexus';

/**
 * Returns a data fetch atom for NexusImage
 * @param imageUrl
 * @param org
 * @param project
 */
export default function createNexusImageDataAtom(
  imageUrl: string,
  org: string,
  project: string
): Atom<Promise<string> | null> {
  return atom((get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    const url = composeUrl('file', imageUrl, { org, project });
    return fetchFileByUrl(url, session)
      .then((res) => res.blob())
      .then((imageResponse) => URL.createObjectURL(imageResponse));
  });
}
