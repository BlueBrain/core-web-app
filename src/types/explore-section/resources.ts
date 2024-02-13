import { NeuriteFeature } from '@/types/explore-section/delta-neurite-feature';
import { ExploreESResponse, ExploreResource } from '@/types/explore-section/es';
import { Contributor as DeltaContributor } from '@/types/explore-section/delta-contributor';
import { Experiment as DeltaExperiment } from '@/types/explore-section/delta-experiment';
import { Image, Subject as DeltaSubject } from '@/types/explore-section/delta-properties';

export type ExploreSectionResource = ExploreResource;

export type ExploreSectionResponse = ExploreESResponse;

export interface ESResponseRaw {
  sort?: number[] | null;
  _id: string;
  _index: string;
  _source: Source;
  _type: string;
}

export type Source = ExploreResource;

// Below is the delta response interface definitions
export type DeltaResource = DeltaExperiment;

export type Subject = DeltaSubject;

export type SerializedDeltaResource = DeltaExperiment & {
  neuriteFeature?: NeuriteFeature[];
};

export type EPhysImageItem = Image;

export type Contributor = DeltaContributor;
