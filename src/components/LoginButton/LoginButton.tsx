import { getServerSession } from 'next-auth/next';

import { SignInButton, SignOutButton } from './buttons';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function LoginButton() {
  const session = await getServerSession(authOptions);

  const sessionValid = session?.user && !session.error;

  return !sessionValid ? (
      <SignInButton />
  ) : (
    <div>
      <div className="mt-6">
        {session.user.name} ({session.user.username})
      </div>
      <SignOutButton />
    </div>
  );
}
