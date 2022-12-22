import { unstable_getServerSession } from 'next-auth/next';

import { SignInButton, SignOutButton } from './buttons';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

import Styles from './login-button.module.css';

export default async function LoginButton() {
  const session = await unstable_getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className={Styles.logoutButton}>
        <SignInButton />

        <div>
          {session.user.name} ({session.user.username})
        </div>
      </div>
    );
  }

  return <SignOutButton />;
}
