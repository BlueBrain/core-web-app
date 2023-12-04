export type SelectedBrainRegion = {
  id: string;
  title: string;
  leaves: string[] | null;
  representedInAnnotation: boolean;
};

export type NavValue = { [key: string]: NavValue } | null;
