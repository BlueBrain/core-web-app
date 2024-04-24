export function createVLApiHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, accept: 'application/json' };
}
