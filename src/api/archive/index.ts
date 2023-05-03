import FileSaver from 'file-saver';
import { Session } from 'next-auth';
import { EntityResource, Distribution, FileMetadata } from '@/types/nexus/common';
import { fetchFileMetadataByUrl, fetchResourceByUrl } from '@/api/nexus';
import { ensureArray } from '@/util/nexus';
import { createHeaders } from '@/util/utils';
import { nexus } from '@/config';

interface ResourceWithDistribution extends EntityResource {
  distribution: Distribution | Distribution[];
}

/** Fetch the file metadata for all distributions associated with a given Nexus resource. */
async function fetchDistribution(selfId: string, session: Session) {
  return fetchResourceByUrl<ResourceWithDistribution>(selfId, session).then((resource) =>
    Promise.all(
      ensureArray(resource.distribution).map((distribution) =>
        fetchFileMetadataByUrl(distribution.contentUrl, session)
      )
    )
  );
}

/** Ensure usable filename length, and override default archive file structure. */
function formatArchiveResource(resource: FileMetadata) {
  const orgProject = new URL(resource._project).pathname.split('/');
  const [org, project] = orgProject.slice(Math.max(orgProject.length - 2, 1));
  const getFileExt = /(?:\.([^.]+))?$/;
  const filename = resource._filename;
  const ext = filename && getFileExt.exec(filename)?.[1];
  const shortFilename = ext && filename.length > 99 && filename.substring(0, 98 - ext.length) + ext;

  return {
    '@type': resource['@type'],
    project: `${org}/${project}`,
    resourceId: resource['@id'],
    path: `/${shortFilename || filename}`,
  };
}

/** Create and return a TAR file containing the provided resources. */
function postNexusArchive(resources: FileMetadata[], session: Session) {
  return fetch(
    `${nexus.url}/archives/${nexus.org}/${nexus.project}/`, // Can be any org/project combo (will be overridden by project property of resource)
    {
      method: 'POST',
      headers: createHeaders(session.accessToken, {
        'Content-Type': 'application/json',
        Accept: 'application/x-tar',
      }),
      body: JSON.stringify({
        resources: resources.map(formatArchiveResource),
      }),
    }
  );
}

/** Create and download a Nexus archive for the provided resource IDs, and trigger a callback, if one is provided. */
export default async function fetchArchive(
  resourceIds: string[],
  session: Session,
  callback: () => void
) {
  if (!session) return null;

  return Promise.all(resourceIds.map((selfId) => fetchDistribution(selfId, session)))
    .then((responses) => responses.flat())
    .then((resources) => postNexusArchive(resources, session))
    .then((response) => response.blob())
    .then(FileSaver.saveAs)
    .then(callback);
}
