/**
 * This function is needed if we wait for the browser to redirect to another URL.
 * @returns A Promise that nevers fulfills.
 */
export async function waitForEver() {
  return new Promise(() => {});
}

export function hideTechnicalURLParams() {
  const win = globalThis.window;
  if (!win) return;

  win.history.pushState({}, document.title, win.location.pathname);
}
