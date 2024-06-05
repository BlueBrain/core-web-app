import { NeuriteFeature } from '@/types/explore-section/delta-neurite-feature';
import { ExploreESResponse, ExploreResource } from '@/types/explore-section/es';
import { Contributor as DeltaContributor } from '@/types/explore-section/delta-contributor';
import { Image, Subject as DeltaSubject } from '@/types/explore-section/delta-properties';

export type ExploreSectionResource = ExploreResource;

// TODO: See comment in ./src/constants/explore-section/fields-config/literature.tsx
// (regarding what to do about this "any" type below)
export type ExploreSectionResponse = ExploreESResponse<any>;

export interface ESResponseRaw {
  sort?: number[] | null;
  _id: string;
  _index: string;
  _source: Source;
  _type: string;
}

export type Source = ExploreResource;

// Below is the delta response interface definitions
export type DeltaResource<T> = T & { reason?: string };

export type Subject = DeltaSubject;

export type SerializedDeltaResource<T> = T & {
  neuriteFeature?: NeuriteFeature[];
};

export type EPhysImageItem = Image;

export type Contributor = DeltaContributor;
