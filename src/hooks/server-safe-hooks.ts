import { redirect } from 'next/navigation';
import { isServer } from '@/config';

export async function useAuthenticatedRoute() {
  if (!isServer) return;
  /* eslint-disable-next-line global-require */
  const { auth } = require('src/auth'); // Only import ifs running on server
  const session = await auth();
  if (!session || session.error || Date.now() >= new Date(session.expires).getTime()) redirect('/');
}
