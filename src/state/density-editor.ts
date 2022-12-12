import { atom } from 'jotai';
import {
  CellCompositionData,
  DistributionSliderSeries,
} from '@/services/distribution-sliders/types';

export const seriesAtom = atom<DistributionSliderSeries[]>([
  {
    color: '#8787E1',
    label: '1',
    percentage: 23,
    isLocked: false,
    breakdown: [
      { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
      { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
      { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
      { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
      { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
      { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
    ],
  },
  {
    color: '#D87286',
    label: '2',
    percentage: 22,
    isLocked: false,
    breakdown: [
      { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
      { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
      { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
      { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
      { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
      { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
    ],
  },
  {
    color: '#631BCF',
    label: '3',
    percentage: 11,
    isLocked: false,
    breakdown: [
      { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
      { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
      { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
      { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
      { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
      { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
    ],
  },
  {
    color: '#CC60ED',
    label: '4',
    percentage: 12,
    isLocked: false,
    breakdown: [
      { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
      { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
      { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
      { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
      { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
      { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
    ],
  },
  {
    color: '#F1C257',
    label: '5',
    percentage: 17,
    isLocked: false,
    breakdown: [
      { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
      { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
      { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
      { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
      { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
      { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
    ],
  },
  {
    color: '#7CF5C3',
    label: '6',
    percentage: 15,
    isLocked: false,
    breakdown: [
      { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
      { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
      { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
      { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
      { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
      { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
    ],
  },
]);

// todo to be removed
export const targetsSeriesAtom = atom<DistributionSliderSeries[]>([
  { color: '#8b8b8b', label: 'bSTUT', percentage: 13.5, isLocked: false },
  { color: '#8b8b8b', label: 'cADpyr', percentage: 22.8, isLocked: false },
  { color: '#8b8b8b', label: 'bIR', percentage: 11.7, isLocked: false },
  { color: '#8b8b8b', label: 'bAC', percentage: 24.3, isLocked: false },
  { color: '#8b8b8b', label: 'cACint', percentage: 8.2, isLocked: false },
  { color: '#8b8b8b', label: 'dNAC', percentage: 19.5, isLocked: false },
]);

export const selectedSeriesLabelAtom = atom<string>('');

export const cellCompositionDataAtom = atom<CellCompositionData | null>(null);
