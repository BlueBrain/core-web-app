export function createApiHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, accept: 'application/json' };
}
