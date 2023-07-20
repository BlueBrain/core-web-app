import { atom, Atom } from 'jotai';
import {
  ImageCollection,
  ImageItem,
} from '@/components/explore-section/EphysViewerContainer/ImageViewComponent';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { FileMetadata } from '@/types/nexus';
import { chainPredicates, hasImage, isFile, not } from '@/util/explore-section/nexus-maybe';
import uniqueArrayOfObjectsByKey from '@/util/explore-section/arrays';
import { propAsArray } from '@/util/explore-section/nexus-tools';
import { DeltaResource, EPhysImageItem } from '@/types/explore-section/resources';

const MAX_BYTES_TO_PREVIEW = 3000000;

// Only fetch five traces at a time.
const PAGINATION_OFFSET = 5;

const getStimulusTypeString = (image: EPhysImageItem) => {
  const typeString = image.stimulusType['@id'].split('/');
  return typeString[typeString.length - 1];
};

export default function createImageCollectionDataAtom(
  resource: DeltaResource,
  page: number,
  stimulusType: string,
  stimulusTypeMap: Map<string, number>
): Atom<Promise<ImageCollection> | null> {
  const [projectLabel, orgLabel] = resource._project.split('/').reverse();
  const imageCollection = new Map<string, ImageItem>();

  /**
   * Function that decides whether an image should be processed.
   * An image is processed if the stimulus type of the image is one of the ones
   * that we want to keep
   *
   * @param image the image item
   */
  const imageShouldBeProcessed = (image: EPhysImageItem) => {
    const typeString = getStimulusTypeString(image);
    // Pagination logic. When stimulusType is All, filter out types that does not belong to the page.
    // All stimulusTypes before the current page will already be in the imageCollection (useImageCollectionDistribution).
    // All stimulusTypes after the current page will be excluded and will not be fetched now.
    if (stimulusType === 'All') {
      const allStimulus = Array.from(stimulusTypeMap.keys());
      const pagedTypes = allStimulus.slice(0, page * PAGINATION_OFFSET + PAGINATION_OFFSET);
      return pagedTypes.includes(typeString);
    }
    return stimulusType === typeString;
  };

  /**
   * Decides whether an image will be rendered.
   *
   * An image is rendered either if all stimulus types are selected or the
   * stimulus type of the image is selected
   *
   * @param imageItem
   */
  const imageShouldBeRendered = (imageItem: ImageItem) =>
    stimulusType === 'All' || imageItem.stimulusType === stimulusType;

  return atom((get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const processImageCollection = async (image: EPhysImageItem) => {
      const { stimulusType: imageST, '@id': id, repetition, about } = image;

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
        // eslint-disable-next-line no-console
        console.warn(`not previewing ${imageResourceMaybe['@id']} because image is too large`);
        return;
      }

      const imageSrc = id;

      const [stimulusTypeKey] = imageST['@id'].split('/').reverse();
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

    const promises = propAsArray<EPhysImageItem>(resource, 'image')
      .filter(imageShouldBeProcessed)
      .map((imageItem) => processImageCollection(imageItem));

    return Promise.all(promises).then(
      () =>
        // filter values we want
        new Map(Array.from(imageCollection).filter((value) => imageShouldBeRendered(value[1])))
    );
  });
}
