import * as React from 'react';
import { useAtomValue } from 'jotai';
import { RemoteData } from '@/types/explore-section/index';
import { DeltaResource } from '@/types/explore-section';
import { propAsArray } from '@/util/explore-section/nexus-tools';
import { chainPredicates, isFile, hasImage, not } from '@/util/explore-section/nexus-maybe';
import uniqueArrayOfObjectsByKey from '@/util/explore-section/arrays';
import {
  ImageCollection,
  ImageItem,
} from '@/components/explore-section/EphysViewerContainer/ImageViewComponent';
import { fetchResourceById } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { FileMetadata } from '@/types/nexus';

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
 * @param opt
 */

export function useImageCollectionDistribution(
  resource: DeltaResource,
  opt?: {
    imageFilterPredicate?: (imageItem: EPhysImageItem) => boolean;
    resultsFilterPredicate?: (imageItem: ImageItem) => boolean;
  }
) {
  const { imageFilterPredicate = () => true, resultsFilterPredicate = () => true } = opt || {};
  const session = useAtomValue(sessionAtom);

  const [{ loading, error, data }, setData] = React.useState<RemoteData<ImageCollection>>({
    loading: true,
    error: null,
    data: null,
  });

  const resourceId = resource['@id'];
  const [projectLabel, orgLabel] = resource._project.split('/').reverse();
  const imageCollection = React.useMemo(() => new Map<string, ImageItem>(), []);

  React.useEffect(() => {
    try {
      if (!resource.image && !resource.distribution) {
        throw new Error('No Image Collection Property Found');
      }
      if (!session) return;

      const processImageCollection = async ({
        stimulusType,
        '@id': id,
        repetition,
        about,
      }: EPhysImageItem) => {
        const imageResourceMaybe = (await fetchResourceById(
          id,
          session,
          {
            org: orgLabel,
            project: projectLabel,
          },
          { Accept: 'application/json' }
        )) as FileMetadata;
        if (chainPredicates([not(isFile), not(hasImage)])(imageResourceMaybe)) {
          return;
        }
        if (
          !imageResourceMaybe._mediaType.includes('image') &&
          imageResourceMaybe._bytes <= MAX_BYTES_TO_PREVIEW
        ) {
          console.warn(`not previewing ${imageResourceMaybe['@id']} because image is too large`);
          return;
        }

        const imageSrc = id;

        const [stimulusTypeKey] = stimulusType['@id'].split('/').reverse();
        const fileName = imageResourceMaybe._filename;

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
