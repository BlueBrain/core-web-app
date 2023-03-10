import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { useSession } from 'next-auth/react';
import sessionAtom from '@/state/session';

export default function useSessionState() {
  const currentSession = useSession();
  const [session, setSession] = useAtom(sessionAtom);

  useEffect(() => {
    if (
      currentSession?.status !== 'authenticated' ||
      currentSession.data.accessToken === session?.accessToken
    )
      return;

    setSession(currentSession.data);
  }, [session?.accessToken, currentSession, setSession]);
}
