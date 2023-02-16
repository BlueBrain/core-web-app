export type BrainRegion = {
  id: string;
  parentId: string | null;
  title: string;
  colorCode: string;
  items?: BrainRegion[];
  leaves?: string[];
  ancestors?: string[];
};
export type Mesh = {
  contentUrl: string;
  brainRegion: string;
};
