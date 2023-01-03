'use client';

import { atom } from 'jotai';

import DEFAULT_PLACEHOLDER_CIRCUIT from './placeholder-data/circuit.json';
import { CircuitResource } from '@/types/nexus';

const circuitAtom = atom<CircuitResource | null>(DEFAULT_PLACEHOLDER_CIRCUIT);

export default circuitAtom;
