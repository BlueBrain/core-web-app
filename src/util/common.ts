import { generateVlProjectUrl } from './virtual-lab/urls';
import { ExploreESHit } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import {
  BASE_EXPERIMENTAL_EXPLORE_PATH,
  BASE_MODEL_EXPLORE_PATH,
} from '@/constants/explore-section/paths';
import { ExperimentTypeNames } from '@/constants/explore-section/data-types/experiment-data-types';
import { BookmarkTabsName, BookmarksSupportedTypes } from '@/types/virtual-lab/bookmark';

export const switchStateType = {
  COUNT: 'count',
  DENSITY: 'density',
};

// formats the number in the 4th significant digit and uses US locale for commas in thousands
export const formatNumber = (num: number) => Number(num.toPrecision(4)).toLocaleString('en-US');

// sorter, used for ant d tables
export const sorter = (a: any, b: any) =>
  Number.isNaN(a) && Number.isNaN(b) ? a - b : `${a}`.localeCompare(b);

export const dateStringToUnix = (a: string) => Math.floor(new Date(a).getTime() / 1000);

export const from64 = (str: string): string => Buffer.from(str, 'base64').toString('binary');

export const to64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

export const isEmpty = (obj: Object) => Object.keys(obj).length === 0;

export function isNumeric(str: string) {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !Number.isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !Number.isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const isValidBase64 = (str: string): boolean => {
  try {
    return (
      Buffer.from(Buffer.from(str, 'base64').toString('binary'), 'binary').toString('base64') ===
      str
    );
  } catch (err) {
    return false;
  }
};

export const detailUrlBuilder = (
  basePath: string,
  resource: ExploreESHit<ExploreSectionResource>
) => `${basePath}/${to64(`${resource._source.project.label}!/!${resource._id}`)}`;

export const detailUrlWithinLab = (
  labId: string,
  labProjectId: string,
  resourceProjectLabel: string,
  resourceId: string,
  bookmarkTab: BookmarkTabsName,
  resourceType: BookmarksSupportedTypes
) => {
  if (bookmarkTab === BookmarkTabsName.SIMULATIONS) {
    return `${generateVlProjectUrl(labId, labProjectId)}/explore/simulate/${resourceType}/view/${to64(`${resourceProjectLabel}!/!${resourceId}`)}`;
  }
  return `${generateVlProjectUrl(labId, labProjectId)}${bookmarkTab === BookmarkTabsName.EXPERIMENTS ? BASE_EXPERIMENTAL_EXPLORE_PATH : BASE_MODEL_EXPLORE_PATH}${resourceType}/${to64(`${resourceProjectLabel}!/!${resourceId}`)}`;
};

export const detailUrlOutsideLab = (
  projectLabel: string,
  resourceId: string,
  resourceType: ExperimentTypeNames
) => `${BASE_EXPERIMENTAL_EXPLORE_PATH}/${resourceType}/${to64(`${projectLabel}!/!${resourceId}`)}`;

export const localCompareString = (a: string, b: string) => a.localeCompare(b);
