export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function fetchAtlasAPI(method, url, accessToken) {
  return fetch(url, {
    method,
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      Accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
    }),
  });
}

function identity(x) {
  console.log(x); // eslint-disable-line no-console

  return x;
}

export default {
  classNames,
  fetchAtlasAPI,
  identity,
};
