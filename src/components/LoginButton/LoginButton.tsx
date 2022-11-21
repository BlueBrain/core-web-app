import loginService from '@/services/login';
import { useLoginAtomValue } from '@/atoms/login';
import Styles from './login-button.module.css';

export default function LoginButton() {
  const login = useLoginAtomValue();

  if (login) {
    return (
      <div className={Styles.logoutButton}>
        <button className={Styles.loginButton} type="button" onClick={() => loginService.logout()}>
          Logout
        </button>
        <div>
          {login.displayname} ({login.username})
        </div>
      </div>
    );
  }

  return (
    <button className={Styles.loginButton} type="button" onClick={() => loginService.login()}>
      Login
    </button>
  );
}
