import { useEffect } from 'react';
import { useSetAtom } from 'jotai/react';

import { useSession } from 'next-auth/react';
import sessionAtom from '@/state/session';

export default function useSessionState() {
  const session = useSession();
  const setSessionAtom = useSetAtom(sessionAtom);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      setSessionAtom(session.data);
    }
  }, [session, setSessionAtom]);
}
