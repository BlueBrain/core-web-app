import * as React from 'react';
import { NexusClient, NexusFile } from '@bbp/nexus-sdk';
import { EphysDeltaResource } from '@/types/observatory';
import { RemoteData } from '@/types/observatory/index';
import { propAsArray } from '@/util/observatory/nexus-tools';
import { chainPredicates, isFile, hasImage, not } from '@/util/observatory/nexus-maybe';
import uniqueArrayOfObjectsByKey from '@/util/observatory/arrays';
import { ImageCollection, ImageItem } from '@/components/observatory/ephys/ImageViewComponent';

const MAX_BYTES_TO_PREVIEW = 3000000;

export type EPhysImageItem = {
  '@id': string;
  repetition: number;
  about: string;
  stimulusType: {
    '@id': string;
  };
};

/**
 * Fetch and process image resources linked in the given resource.
 * image resources are fetched and the ordered/mapped based on their stimulus type and repetition they belong to.
 *
 * @param resource
 * @param nexus
 * @param opt
 */

export function useImageCollectionDistribution(
  resource: EphysDeltaResource,
  nexus: NexusClient,
  opt?: {
    imageFilterPredicate?: (imageItem: EPhysImageItem) => boolean;
    resultsFilterPredicate?: (imageItem: ImageItem) => boolean;
  }
) {
  const { imageFilterPredicate = () => true, resultsFilterPredicate = () => true } = opt || {};

  const [{ loading, error, data }, setData] = React.useState<RemoteData<ImageCollection>>({
    loading: true,
    error: null,
    data: null,
  });

  const resourceId = resource['@id'];

  const [projectLabel, orgLabel] = resource._project.split('/').reverse();

  const imageCollection = React.useMemo(() => new Map<string, ImageItem>(), [resourceId]);

  React.useEffect(() => {
    try {
      if (!resource.image && !resource.distribution) {
        throw new Error('No Image Collection Property Found');
      }

      const processImageCollection = async ({
        stimulusType,
        '@id': id,
        repetition,
        about,
      }: EPhysImageItem) => {
        const ImageResourceMaybe = (await nexus.Resource.get(
          orgLabel,
          projectLabel,
          encodeURIComponent(id)
        )) as NexusFile;

        if (chainPredicates([not(isFile), not(hasImage)])(ImageResourceMaybe)) {
          return;
        }

        if (
          !ImageResourceMaybe._mediaType.includes('image') &&
          ImageResourceMaybe._bytes <= MAX_BYTES_TO_PREVIEW
        ) {
          console.warn(`not previewing ${ImageResourceMaybe['@id']} because image is too large`);
          return;
        }

        const imageSrc = id;

        const [stimulusTypeKey] = stimulusType['@id'].split('/').reverse();
        const fileName = ImageResourceMaybe._filename;

        const stimulusCollection = imageCollection.get(stimulusTypeKey);
        if (stimulusCollection) {
          // Make sure rep list is unique

          stimulusCollection.repetitions[repetition] = uniqueArrayOfObjectsByKey<
            { imageSrc: string; fileName: string; about?: string },
            keyof { imageSrc: string; fileName: string; about: string }
          >(
            [...(stimulusCollection.repetitions[repetition] || []), { imageSrc, fileName, about }],
            'imageSrc'
          );
        } else {
          imageCollection.set(stimulusTypeKey, {
            stimulusType: stimulusTypeKey,
            repetitions: {
              [repetition]: [{ imageSrc, fileName, about }],
            },
          });
        }
      };

      setData({
        data,
        error: null,
        loading: true,
      });

      const promises = propAsArray<EPhysImageItem>(resource, 'image')
        .filter(imageFilterPredicate)
        .map((imageItem) => processImageCollection(imageItem));

      Promise.all(promises)
        .then(() => {
          // filter values we want
          const promiseData = new Map(
            Array.from(imageCollection).filter((value) => resultsFilterPredicate(value[1]))
          );
          setData({
            data: promiseData,
            error: null,
            loading: false,
          });
        })
        .catch((resError) => {
          throw resError;
        });
    } catch (resError: any) {
      setData({
        error: resError,
        data: null,
        loading: false,
      });
    }
  }, [resourceId, imageFilterPredicate]);

  return { loading, error, data };
}
