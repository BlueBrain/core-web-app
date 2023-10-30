import { nexus } from '@/config';
import { FileMetadata } from '@/types/nexus';
import { composeUrl, createDistribution } from '@/util/nexus';

const revParam = '?rev=';

describe('Resource', () => {
  const rev = 989;

  const resourceIdNoRev =
    'https://bbp.epfl.ch/neurosciencegraph/data/cellcompositionconfigs/20000425-4ecf-4968-92a0-ad68feb5ba47';
  const resourceIdWithRev = `${resourceIdNoRev}${revParam}${rev}`;

  const nexusBase = `${nexus.url}/resources/${nexus.org}/${nexus.project}/_`;
  const resourceUrlNoRev = `${nexusBase}/${encodeURIComponent(resourceIdNoRev)}`;
  const resourceUrlWithRev = `${resourceUrlNoRev}${revParam}${rev}`;

  const fullResourceUrlWithRev =
    'https://bbp.epfl.ch/nexus/v1/resources/bbp/mmb-point-neuron-framework-model/_/https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2Fcellcompositionconfigs%2F20000425-4ecf-4968-92a0-ad68feb5ba47?rev=989';

  it('code encoding correct url', () => {
    expect(resourceUrlWithRev).toBe(fullResourceUrlWithRev);
  });

  describe('no revision in url', () => {
    it('no rev in params', () => {
      const composed = composeUrl('resource', resourceIdNoRev);
      expect(composed).toBe(resourceUrlNoRev);
    });
    it('rev in params', () => {
      const testRev = 1;
      const composed = composeUrl('resource', resourceIdNoRev, { rev: testRev });
      expect(composed).toBe(`${resourceUrlNoRev}${revParam}${testRev}`);
    });
  });

  describe('with revision in url', () => {
    it('no rev in params', () => {
      const composed = composeUrl('resource', resourceIdWithRev);
      const resourceUrlWithRevEncoded = `${resourceUrlNoRev}${encodeURIComponent(
        `${revParam}${rev}`
      )}`;
      expect(composed).toBe(resourceUrlWithRevEncoded);
    });
    it('rev in params', () => {
      const testRev = 1;
      const composed = composeUrl('resource', resourceIdWithRev, { rev: testRev });
      expect(composed).toBe(`${resourceUrlNoRev}${revParam}${testRev}`);
    });
  });
});

describe('Files', () => {
  const rev = 1013;

  const fileIdNoRev =
    'https://bbp.epfl.ch/neurosciencegraph/data/8a9b7a11-3629-48d4-aeba-bd991c1696bd';
  const fileIdWithRev = `${fileIdNoRev}${revParam}${rev}`;

  const nexusBase = `${nexus.url}/files/${nexus.org}/${nexus.project}`;
  const fileUrlNoRev = `${nexusBase}/${encodeURIComponent(fileIdNoRev)}`;
  const fileUrlWithRev = `${fileUrlNoRev}${revParam}${rev}`;

  const fullFileUrlWithRev =
    'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2F8a9b7a11-3629-48d4-aeba-bd991c1696bd?rev=1013';

  it('code encoding correct url', () => {
    expect(fileUrlWithRev).toBe(fullFileUrlWithRev);
  });

  describe('no revision in url', () => {
    it('no rev in params', () => {
      const composed = composeUrl('file', fileIdNoRev);
      expect(composed).toBe(fileUrlNoRev);
    });
    it('rev in params', () => {
      const testRev = 1;
      const composed = composeUrl('file', fileIdNoRev, { rev: testRev });
      expect(composed).toBe(`${fileUrlNoRev}${revParam}${testRev}`);
    });
  });

  describe('with revision in url', () => {
    it('no rev in params', () => {
      const composed = composeUrl('file', fileIdWithRev);
      const fileUrlWithRevEncoded = `${fileUrlNoRev}${encodeURIComponent(`${revParam}${rev}`)}`;
      expect(composed).toBe(fileUrlWithRevEncoded);
    });
    it('rev in params', () => {
      const testRev = 1;
      const composed = composeUrl('file', fileIdWithRev, { rev: testRev });
      expect(composed).toBe(`${fileUrlNoRev}${revParam}${testRev}`);
    });
  });

  describe('creating distribution file', () => {
    const mockMetaFile: FileMetadata = {
      '@id': '123',
      '@type': 'File',
      _bytes: 1,
      _createdAt: '',
      _createdBy: '',
      _deprecated: false,
      _digest: {
        _algorithm: '',
        _value: '',
      },
      _filename: '',
      _mediaType: '',
      _project: '',
      _rev: 1,
      _self: '',
      _storage: {
        '@id': '',
        '@type': 'DiskStorage',
        _rev: 1,
      },
      _updatedAt: '',
      _updatedBy: '',
    };

    const encodedId =
      'https%3A%2F%2Fbbp.epfl.ch%2Fdata%2Fbbp%2Fmmb-point-neuron-framework-model%2F123';

    it('rev in metadata', () => {
      const dist = createDistribution(mockMetaFile);
      const expectedUrl = `${nexusBase}/${encodedId}${revParam}${mockMetaFile._rev}`;
      expect(dist.contentUrl).toBe(expectedUrl);
    });

    it('rev not in metadata', () => {
      const clone = structuredClone(mockMetaFile);
      // @ts-ignore
      delete clone._rev;
      expect(() => createDistribution(clone)).toThrow();
    });
  });
});
