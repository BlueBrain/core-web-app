export default async function loadMeshFromURL(
  url: string,
  token: string
): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok)
      throw Error(`HTTP error code is ${response.status} (${response.statusText})!`);

    const content = await response.text();
    return content;
  } catch (ex) {
    console.error('Unable to fetch mesh from:', url);
    console.error(ex);
    return undefined;
  }
}
