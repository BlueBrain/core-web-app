import GenericEvent, { GenericEventInterface } from './generic-event';
import { CLIENT_ID, KEYCLOAK_AUTH_URL, KEYCLOAK_TOKEN_URL, KEYCLOAK_USERINFO_URL } from './config';
import { createCodeVerifier, getCodeChallenge } from './crypto';
import { hideTechnicalURLParams, waitForEver } from './util';
import { isKeycloakTokenResponse, isUserInfo } from './types';
import { storageDelete, storageLoad, storageSave } from './storage';

export interface LoginServiceUserInfo {
  /** Ex: `joe.dalton@epfl.ch` */
  email: string;
  /** Ex: `Joe DALTON` */
  displayName: string;
  /** Ex: `joedalto` */
  preferredUserName: string;
  /** Ex: `Joe` */
  givenName: string;
  /** Ex: `Dalton` */
  familyName: string;
}

export interface LoginServiceTokens {
  access: string;
  id: string;
}

const CURRENTLY_LOGGED = 'LoginService/currently-logged';

class LoginService {
  /**
   * Add a listener to this event to be notified of login state changes.
   */
  public readonly eventLogged: GenericEventInterface<boolean> = new GenericEvent<boolean>();

  private readonly initPromise: Promise<void>;

  private isLoggedValue = false;

  private userInfoValue: LoginServiceUserInfo | null = null;

  private tokensValue: LoginServiceTokens | null = null;

  constructor() {
    this.initPromise = this.createInitializePromise();
  }

  /**
   * Call this method at startup before you can use any other method or attribute.
   * You can call this method as often as you want and even when an initialization
   * is in progress, but only one actual intialization will be performed.
   */
  async initialize(): Promise<void> {
    await this.initPromise;
  }

  /**
   *
   * @returns
   */
  async login(): Promise<void> {
    await this.initialize();
    if (this.isLogged) return;

    this.isLogged = false;
    const codeVerifier = createCodeVerifier();
    storageSave('codeVerifier', codeVerifier);
    const requestParams = {
      client_id: CLIENT_ID,
      redirect_uri: globalThis.window?.location.href,
      code_challenge: getCodeChallenge(codeVerifier),
      response_type: 'code',
      code_challenge_method: 'S256',
      scope: 'profile openid nexus groups',
    };
    const requestUrl = new URL(KEYCLOAK_AUTH_URL);
    Object.entries(requestParams).forEach(([key, value]) =>
      requestUrl.searchParams.append(key, value)
    );
    const win = globalThis.window;
    if (win) win.location.href = requestUrl.toString();
    // We will redirect to KeyCloak login screen.
    // So we need to wait.
    await waitForEver();
  }

  async logout(): Promise<void> {
    storageDelete(CURRENTLY_LOGGED);
    this.isLogged = false;
    const win = globalThis.window;
    if (win) win.location.reload();
    await waitForEver();
  }

  get tokens() {
    return this.tokensValue;
  }

  get userInfo() {
    return this.userInfoValue;
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
        Authorization: `Bearer ${this.tokens?.access}`,
      },
      redirect: 'follow',
      referrer: 'no-referrer',
    });
    if (!response.ok) {
      throw Error(`Query failed with error code ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  private async createInitializePromise(): Promise<void> {
    /**
     * At startup, we must check if we are coming from a KeyCloak redirection.
     * If so, we can retrieve the authorization code from URL params and ask
     * for a token.
     */
    const codeVerifier = storageLoad('codeVerifier');
    const args = new URLSearchParams(globalThis.window?.location.search);
    const authorizationCode = args.get('code');
    const sessionState = args.get('session_state');
    if (!codeVerifier || !authorizationCode || !sessionState) {
      // We are not coming from a KeyCloak redirection.
      // Let's check if we are already logged and need to reconnect.
      if (!storageLoad(CURRENTLY_LOGGED)) return;

      await this.login();
      return;
    }

    storageDelete('codeVerifier');
    hideTechnicalURLParams();
    const requestParams = {
      client_id: CLIENT_ID,
      redirect_uri: globalThis.window?.location.href,
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

    this.tokensValue = {
      access: data.access_token,
      id: data.id_token,
    };
    const userInfo = await this.query(KEYCLOAK_USERINFO_URL);
    if (isUserInfo(userInfo)) {
      this.userInfoValue = {
        displayName: userInfo.name,
        email: userInfo.email,
        familyName: userInfo.family_name,
        givenName: userInfo.given_name,
        preferredUserName: userInfo.preferred_username,
      };
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid result for UserInfo:', userInfo);
      this.userInfoValue = null;
    }
    storageSave(CURRENTLY_LOGGED, 'true');
    this.isLogged = true;
  }
}

const singleton = new LoginService();
singleton.initialize();
export default singleton;
