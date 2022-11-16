import { atom, useAtomValue } from 'jotai';

export interface LoginAtomInterface {
  username: string;
  displayname: string;
  accessToken: string;
  idToken: string;
}

export const loginAtom = atom<LoginAtomInterface | null>(null);

/**
 * @returns `null` if the user is not currently logged.
 */
export function useLoginAtomValue(): LoginAtomInterface | null {
  return useAtomValue(loginAtom);
}
