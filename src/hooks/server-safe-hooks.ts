import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function useAuthenticatedRoute() {
  const session = await auth();
  if (!session || session.error || Date.now() >= new Date(session.expires).getTime()) redirect('/');
}
