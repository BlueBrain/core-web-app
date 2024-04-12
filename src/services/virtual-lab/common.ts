export function createVLApiHeaders(token: string) {
  return { Authorization: token, accept: 'application/json' };
}
