import { captureException } from '@sentry/nextjs';

import { createHeaders } from '@/util/utils';
import { FileType } from '@/components/papers/uploader/utils';
import { OnUploadInput, UploaderGeneratorResponse } from '@/components/papers/uploader/types';
import { Distribution, FileMetadata, PaperResource } from '@/types/nexus';
import { composeUrl, createDistribution, ensureArray, removeMetadata } from '@/util/nexus';

export default async function* uploadBinaries({
  accessToken,
  uploadUrl,
  files,
  location,
  callback,
}: OnUploadInput): AsyncGenerator<UploaderGeneratorResponse> {
  const distributions: Array<Distribution> = [];
  try {
    // Upload images and yield the result to show the status on tht thumbnail
    for (const f of files) {
      const formData = new FormData();
      formData.append('file', f.file as FileType, f.file.name);
      const result = await fetch(uploadUrl, {
        method: 'post',
        headers: createHeaders(accessToken, {
          'x-nxs-file-metadata': JSON.stringify({
            name: f.name || f.id,
            // TODO: use filename without extension rather then `id` (which one is better ??),
            // TODO: image.file.name.replace(/\.[^/.]+$/, "")
            description: f.alt ?? '',
          }),
        }),
        body: formData,
      });
      if (!result.ok) {
        captureException(new Error(await result.json()), {
          tags: { section: 'paper', feature: 'upload_paper_binaries' },
          extra: {
            virtualLabId: location.org,
            projectId: location.project,
            action: 'delta_upload_binary_file',
          },
        });
        yield { source: 'binary', status: 'failed', id: f.id };
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
      yield { source: 'binary', status: 'success', id: f.id };
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
      captureException(new Error(await resourceResponse.json()), {
        tags: { section: 'paper', feature: 'upload_paper_binaries' },
        extra: {
          virtualLabId: location.org,
          projectId: location.project,
          action: 'delta_fetch_latest_paper_details',
        },
      });
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
      captureException(new Error(await response.json()), {
        tags: { section: 'paper', feature: 'upload_paper_binaries' },
        extra: {
          virtualLabId: location.org,
          projectId: location.project,
          action: 'delta_update_paper_resource_distribution',
        },
      });
      yield { source: 'resource', status: 'failed' };
    }
    // Update the paper editor
    callback?.(distributions, files);
    yield { source: 'resource', status: 'success' };
  } catch (error) {
    captureException(error, {
      tags: { section: 'paper', feature: 'upload_paper_binaries' },
      extra: {
        virtualLabId: location.org,
        projectId: location.project,
        action: 'server_upload_paper_binaries',
      },
    });
    yield null;
  }
}
