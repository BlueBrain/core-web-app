import GenericEvent, { GenericEventInterface } from './generic-event';
import { CLIENT_ID, KEYCLOAK_AUTH_URL, KEYCLOAK_TOKEN_URL, KEYCLOAK_USERINFO_URL } from './config';
import { createCodeVerifier, getCodeChallenge } from './crypto';
import { isKeycloakTokenResponse, isUserInfo } from './types';
import { storageDelete, storageLoad, storageSave } from './storage';

class LoginService {
  public readonly eventLogged: GenericEventInterface<boolean> = new GenericEvent<boolean>();

  private isLoggedValue = false;

  private userNameValue = '';

  private userEMailValue = '';

  private tokenValue: string | null = null;

  get userName() {
    return this.userNameValue;
  }

  get userEMail() {
    return this.userEMailValue;
  }

  /**
   * At startup, we must check if we are coming from a KeyCloak redirection.
   * If so, we can retrieve the authorization code from URL params and ask
   * for a token.
   */
  async initialize(): Promise<void> {
    const codeVerifier = storageLoad('codeVerifier');
    const args = new URLSearchParams(globalThis.window?.location.search);
    const authorizationCode = args.get('code');
    const sessionState = args.get('session_state');
    if (!codeVerifier || !authorizationCode || !sessionState) {
      // We are not coming from a KeyCloak redirection.
      return;
    }

    storageDelete('codeVerifier');
    const requestParams = {
      client_id: CLIENT_ID,
      redirect_uri: globalThis.window?.location.origin,
      grant_type: 'authorization_code',
      code: authorizationCode,
      code_verifier: codeVerifier,
    };
    const requestUrl = new URL(KEYCLOAK_TOKEN_URL);
    const requestBody = new URLSearchParams();
    Object.entries(requestParams).forEach(([key, value]) => requestBody.append(key, value));
    const request = new Request(requestUrl.toString(), {
      redirect: 'follow',
      method: 'post',
      headers: [
        ['Content-Type', 'application/x-www-form-urlencoded'],
        ['Accept', 'application/json'],
      ],
      body: requestBody,
    });
    const response = await fetch(request);
    if (!response.ok && response.status !== 200) {
      // We will need a proper loggin with Sentry, later.
      // eslint-disable-next-line no-console
      console.error('Unable to get access token from Keycloak!');
      return;
    }
    const data = await response.json();
    if (!isKeycloakTokenResponse(data)) {
      // eslint-disable-next-line no-console
      console.error('Keycloak returned an expected object:', data);
      return;
    }

    this.tokenValue = data.access_token;
    const userInfo = await this.query(KEYCLOAK_USERINFO_URL);
    if (isUserInfo(userInfo)) {
      this.userEMailValue = userInfo.email;
      this.userNameValue = userInfo.name;
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid result for UserInfo:', userInfo);
      this.userEMailValue = '';
      this.userNameValue = '';
    }
    this.isLogged = true;
  }

  login(): void {
    this.isLogged = false;
    const codeVerifier = createCodeVerifier();
    storageSave('codeVerifier', codeVerifier);
    const requestParams = {
      client_id: CLIENT_ID,
      redirect_uri: globalThis.window?.location.origin,
      code_challenge: getCodeChallenge(codeVerifier),
      response_type: 'code',
      code_challenge_method: 'S256',
      scope: 'profile openid',
    };
    const requestUrl = new URL(KEYCLOAK_AUTH_URL);
    Object.entries(requestParams).forEach(([key, value]) =>
      requestUrl.searchParams.append(key, value)
    );
    const win = globalThis.window;
    if (win) win.location.href = requestUrl.toString();
  }

  get token() {
    return this.tokenValue;
  }

  public get isLogged() {
    return this.isLoggedValue;
  }

  private set isLogged(value: boolean) {
    this.isLoggedValue = value;
    const event = this.eventLogged as GenericEvent<boolean>;
    event.dispatch(value);
  }

  private async query(url: string): Promise<unknown> {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      redirect: 'follow',
      referrer: 'no-referrer',
    });
    if (!response.ok) {
      throw Error(`Query failed with error code ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

const singleton = new LoginService();
singleton.initialize();
const loginInterface: LoginServiceInterface = singleton;

export type LoginServiceInterface = Omit<LoginService, 'initialize'>;
export default loginInterface;
