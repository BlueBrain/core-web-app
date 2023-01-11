export function createHeaders(
  token: string,
  extraOptions: any = { 'Content-Type': 'application/json', Accept: '*/*' }
) {
  return new Headers({
    Authorization: `Bearer ${token}`,
    ...extraOptions,
  });
}

export function classNames(...classes: Array<string | null | undefined | boolean>) {
  return classes.filter(Boolean).join(' ');
}

export function fetchAtlasAPI(method: string, url: string, accessToken: string) {
  return fetch(url, {
    method,
    headers: createHeaders(accessToken, { Accept: '*/*' }),
  });
}
