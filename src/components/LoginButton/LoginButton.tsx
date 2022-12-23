import { unstable_getServerSession } from 'next-auth/next';

import { SignInButton, SignOutButton } from './buttons';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function LoginButton() {
  const session = await unstable_getServerSession(authOptions);

  return !session?.user ? (
    <SignInButton />
  ) : (
    <div>
      <SignOutButton />
      <div>
        {session.user.name} ({session.user.username})
      </div>
    </div>
  );
}
