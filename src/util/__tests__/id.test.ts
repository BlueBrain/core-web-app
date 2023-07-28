import crypto from 'crypto';

import { nexus } from '@/config';
import { createId } from '@/util/nexus';

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: crypto.randomUUID,
  },
});

const orgAndProjStr = `${nexus.org}/${nexus.project}`;
const fileBase = `${nexus.url}/files/${orgAndProjStr}`;
const resourceBase = `${nexus.url}/resources/${orgAndProjStr}`;

describe('util/id.test.ts', () => {
  describe('Nexus configuration', () => {
    it('correct endpoint', () => {
      expect(nexus.url).toBe('https://bbp.epfl.ch/nexus/v1');
    });
    it('correct organization', () => {
      expect(nexus.org).toBe('bbp');
    });
    it('correct project', () => {
      expect(nexus.project).toBe('mmb-point-neuron-framework-model');
    });
  });

  describe('Generation of ids', () => {
    it('for file', () => {
      const id = createId('file');
      expect(id).toContain(fileBase);
    });
    it('for file with id', () => {
      const id = createId('file', '123');
      expect(id).toBe(`${fileBase}/123`);
    });
    it('for resource', () => {
      const id = createId('cellcompositionconfig');
      expect(id).toContain(resourceBase);
    });
    it('for resource with id', () => {
      const id = createId('morphologyassignmentconfig', '123');
      expect(id).toBe(`${resourceBase}/_/123`);
    });
    it('makes sure that there are not repeated parts', () => {
      const id = createId('morphologyassignmentconfig');
      const originalCount = id.split('/');
      const withoutRepetition = new Set(originalCount);
      expect(originalCount.length).toBe(withoutRepetition.size);
    });
  });
});
