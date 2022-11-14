import * as React from 'react';
import { loginService } from '@/services/login';
import Styles from './login-button.module.css';
import { GenericEventInterface } from '../../services/login/generic-event';

function useGenericEvent<T>(event: GenericEventInterface<T>, defaultValue: T): T {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    event.addListener(setValue);
    return () => event.removeListener(setValue);
  }, [event]);
  return value;
}

export default function LoginButton() {
  const islogged = useGenericEvent(loginService.eventLogged, loginService.isLogged);
  if (islogged) {
    return (
      <div className={Styles.logoutButton}>
        <div>{loginService.userName}</div>
      </div>
    );
  }

  return (
    <button className={Styles.loginButton} type="button" onClick={() => loginService.login()}>
      Login
    </button>
  );
}
