export type SelectedBrainRegion = {
  id: string;
  title: string;
  leaves: string[] | null;
};

export type NavValue = { [key: string]: NavValue } | null;

export type DefaultBrainRegionType = {
  value: {
    id: string;
    title: string;
    leaves: null | string[];
  };
};
