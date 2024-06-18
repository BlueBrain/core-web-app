import {
  FileType,
  OnUploadInput,
  UploaderGeneratorResponse,
} from '@/components/papers/PaperEditor/plugins/ImagePlugin/utils';
import { Distribution, FileMetadata, PaperResource } from '@/types/nexus';
import { composeUrl, createDistribution, ensureArray, removeMetadata } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

export default async function* uploadBinaries({
  accessToken,
  uploadUrl,
  images,
  location,
  callback,
}: OnUploadInput): AsyncGenerator<UploaderGeneratorResponse> {
  const distributions: Array<Distribution> = [];
  try {
    // Upload images and yield the result to show the status on tht thumbnail
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image.file as FileType, image.file.name);
      const result = await fetch(uploadUrl, {
        method: 'post',
        headers: createHeaders(accessToken, {
          'x-nxs-file-metadata': JSON.stringify({
            name: image.name || image.id,
            // TODO: use filename without extension rather then `id` (which one is better),
            // TODO: image.file.name.replace(/\.[^/.]+$/, "")
            description: image.alt ?? '',
          }),
        }),
        body: formData,
      });
      if (!result.ok) {
        yield { source: 'image', status: 'failed', id: image.id };
      }
      const metadata = await result.json();
      distributions.push(
        createDistribution(
          metadata as FileMetadata,
          composeUrl('file', metadata['@id'], {
            rev: metadata._rev,
            org: location.org,
            project: location.project,
          })
        )
      );
      yield { source: 'image', status: 'success', id: image.id };
    }
    // Update the paper resource
    const resourceResponse = await fetch(
      composeUrl('resource', location.id, {
        org: location.org,
        project: location.project,
      }),
      {
        headers: createHeaders(accessToken),
      }
    );
    const remotePaperResource: PaperResource = await resourceResponse.json();
    if (!resourceResponse.ok) {
      yield { source: 'resource', status: 'failed' };
    }
    const paperDistribution = ensureArray(remotePaperResource.distribution);
    const distribution = [...paperDistribution, ...distributions];

    const body = removeMetadata({
      ...remotePaperResource,
      distribution,
    }) as PaperResource;
    const response = await fetch(
      composeUrl('resource', remotePaperResource['@id'], {
        rev: remotePaperResource._rev,
        org: location.org,
        project: location.project,
        sync: true,
      }),
      {
        method: 'PUT',
        headers: createHeaders(accessToken),
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      yield { source: 'resource', status: 'failed' };
    }
    // Update the paper editor
    callback?.(distributions, images);
    yield { source: 'resource', status: 'success' };
  } catch (error) {
    yield null;
  }
}
