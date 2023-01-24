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
    console.log('🚀 [menu-view] response = ', response); // @FIXME: Remove this line written on 2023-01-23 at 09:08
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
