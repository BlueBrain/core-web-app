'use client';

import { atom } from 'jotai';
import { Session } from 'next-auth';

const sessionAtom = atom<Session | null>(null);

export default sessionAtom;
