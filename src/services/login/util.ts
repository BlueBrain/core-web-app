/**
 * This function is needed if we wait for the browser to redirect to another URL.
 * @returns A Promise that nevers fulfills.
 */
export async function waitForEver() {
  return new Promise(() => {});
}

export function stripAuthRelatedQueryParams(href: string) {
  const url = new URL(href);

  url.searchParams.delete('session_state');
  url.searchParams.delete('code');

  return url.toString();
}
