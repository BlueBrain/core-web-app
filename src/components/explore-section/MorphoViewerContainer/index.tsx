'use client';

import { useEffect, useState } from 'react';
import matches from 'lodash/matches';
import { useAtomValue } from 'jotai';
import MorphoWrapper from './MorphoWrapper';
import { MorphoViewerOptions } from './MorphologyViewer';
import { DeltaResource } from '@/types/explore-section';
import { composeUrl } from '@/util/nexus';
import { fetchFileByUrl } from '@/api/nexus';
import sessionAtom from '@/state/session';

const SHAPE = {
  '@type': 'DataDownload',
  encodingFormat: 'application/swc',
};

function MorphoViewerContainer({ resource }: { resource: DeltaResource }) {
  const [{ loading, error, data }, setData] = useState<{
    loading: boolean;
    error: Error | null;
    data: any;
  }>({
    loading: true,
    error: null,
    data: null,
  });

  const session = useAtomValue(sessionAtom);

  const [options, setOptions] = useState<MorphoViewerOptions>({
    asPolyline: false,
    focusOn: true,
    somaMode: 'fromOrphanSections',
  });

  useEffect(() => {
    if (!session) return;
    if (!resource.distribution) {
      setData({
        loading: false,
        error: new Error(`No distribution found for resource ${resource['@id']}`),
        data: null,
      });
      return;
    }

    const distribution = Array.isArray(resource.distribution)
      ? resource.distribution
      : [resource.distribution];

    const traceDistro = distribution.find(matches(SHAPE));

    if (!traceDistro) {
      setData({
        loading: false,
        error: new Error(
          `No distribution found for resource ${resource['@id']} with shape ${SHAPE}`
        ),
        data: null,
      });
      return;
    }

    const [projectLabel, orgLabel] = resource._project.split('/').reverse();
    const [id] = traceDistro.contentUrl.split('/').reverse();
    const url = composeUrl('file', decodeURIComponent(id), {
      org: orgLabel,
      project: projectLabel,
      idExpand: false,
    });
    fetchFileByUrl(url, session)
      .then((resp) => resp.text())
      .then((fetchedData) => {
        setData({
          data: fetchedData,
          error: null,
          loading: false,
        });
      })
      .catch((fetchError) => {
        setData({
          error: fetchError,
          data: null,
          loading: false,
        });
      });
  }, [resource, session]);

  const handleAsPolyline = () => {
    setOptions({
      ...options,
      asPolyline: !options.asPolyline,
    });
  };

  return (
    <MorphoWrapper
      {...{
        loading,
        error,
        data,
        options,
        onPolylineClick: handleAsPolyline,
      }}
    />
  );
}

export default MorphoViewerContainer;
