export async function parseTemplateFile(blob: Blob): Promise<unknown> {
  const content = await blob.text();
  const contentWithoutPlaceHolders = content.split(/\$[a-z0-9_]+/i).join('0');
  return JSON.parse(contentWithoutPlaceHolders);
}
