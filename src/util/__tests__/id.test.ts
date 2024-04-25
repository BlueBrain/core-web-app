import crypto from 'crypto';

import { nexus } from '@/config';
import { expandId } from '@/util/nexus';

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: crypto.randomUUID,
  },
});

describe('util/id.test.ts', () => {
  describe('Nexus configuration', () => {
    it('correct endpoint', () => {
      expect(nexus.url).toBe('https://sbo-nexus-delta.shapes-registry.org/v1');
    });
    it('correct id base url', () => {
      expect(nexus.defaultIdBaseUrl).toBe(
        'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model'
      );
    });
    it('correct organization', () => {
      expect(nexus.org).toBe('bbp');
    });
    it('correct project', () => {
      expect(nexus.project).toBe('mmb-point-neuron-framework-model');
    });
  });

  describe('Expand IDs', () => {
    it('using uuid', () => {
      const id = expandId('123');
      expect(id).toBe(`${nexus.defaultIdBaseUrl}/123`);
    });
    it('using empty', () => {
      const id = expandId('');
      expect(id).toBe('');
    });
    it('using url', () => {
      const url =
        'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/5c41379e-3b6c-425b-a82a-67305cc6b8d4';
      const id = expandId(url);
      expect(id).toBe(url);
    });
  });
});
