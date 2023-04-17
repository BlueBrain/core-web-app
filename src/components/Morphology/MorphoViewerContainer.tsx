import { useEffect, useState } from 'react';
import { NexusClient } from '@bbp/nexus-sdk';
import matches from 'lodash/matches';
import MorphoWrapper from './MorphoWrapper';
import { MorphoViewerOptions } from './MorphologyViewer';
import { DeltaResource } from '@/types/explore-section';

const SHAPE = {
  '@type': 'DataDownload',
  encodingFormat: 'application/swc',
};

function MorphoViewerContainer({
  resource,
  nexus,
}: {
  resource: DeltaResource;
  nexus: NexusClient;
}) {
  const [{ loading, error, data }, setData] = useState<{
    loading: boolean;
    error: Error | null;
    data: any;
  }>({
    loading: true,
    error: null,
    data: null,
  });

  const [options, setOptions] = useState<MorphoViewerOptions>({
    asPolyline: false,
    focusOn: true,
    somaMode: 'fromOrphanSections',
  });

  useEffect(() => {
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

    nexus.File.get(orgLabel, projectLabel, id, { as: 'text' })
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
  }, [resource['@id']]);

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
