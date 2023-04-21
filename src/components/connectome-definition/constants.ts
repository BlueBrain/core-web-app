
import { HemisphereDirection } from "@/types/connectome";

export const hemisphereDirection: Record<HemisphereDirection, string> = {
  LL: 'Left to left',
  LR: 'Left to right',
  RL: 'Right to left',
  RR: 'Right to right',
};

export const hemisphereDirectionIdxMap: Record<HemisphereDirection, number> = {
  'LL': 0,
  'LR': 1,
  'RL': 2,
  'RR': 3,
};
