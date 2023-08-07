export interface SynapticAssignmentRule {
  fromSClass: null | string;
  toSClass: null | string;
  fromHemisphere: null | string;
  toHemisphere: null | string;
  fromRegion: null | string;
  toRegion: null | string;
  fromMType: null | string;
  toMType: null | string;
  toEType: null | string;
  fromEType: null | string;
  synapticType: string;
}

export interface SynapticType {
  gsyn: number;
  gsynSD: number;
  nrrp: number;
  dtc: number;
  dtcSD: number;
  u: number;
  uSD: number;
  d: number;
  dSD: number;
  f: number;
  fSD: number;
  gsynSRSF: number;
  uHillCoefficient: number;
  synapticModel?: string;
}
