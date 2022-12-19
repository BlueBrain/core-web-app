'use client';

import { atom } from 'jotai';

import DEFAULT_PLACEHOLDER_CIRCUIT from './placeholder-data/circuit.json';
import { Circuit } from '@/types/nexus';

const circuitAtom = atom<Circuit | null>(DEFAULT_PLACEHOLDER_CIRCUIT);

export default circuitAtom;
