import { signIn, signOut, useSession } from 'next-auth/react';
import Styles from './login-button.module.css';

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className={Styles.logoutButton}>
        <button className={Styles.loginButton} type="button" onClick={() => signOut()}>
          Logout
        </button>
        <div>
          {session.user.name} ({session.user.username})
        </div>
      </div>
    );
  }

  return (
    <button className={Styles.loginButton} type="button" onClick={() => signIn('keycloak')}>
      Login
    </button>
  );
}
