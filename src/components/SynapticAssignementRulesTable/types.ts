export interface SynapticAssignementRule {
  fromSClass: null | string;
  toSClass: null | string;
  synapticType: string;
  fromHemisphere: null | string;
  toHemisphere: null | string;
  fromRegion: null | string;
  toRegion: null | string;
  fromMType: null | string;
  toMType: null | string;
  toEType: null | string;
  fromEType: null | string;
}

export interface IndexedSynapticAssignementRule extends SynapticAssignementRule {
  index: number;
}
