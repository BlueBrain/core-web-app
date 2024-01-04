import {
  formatContributors,
  formatEsContributors,
} from '@/components/explore-section/Contributors';
import { normalizeContributors, sortContributors } from '@/util/explore-section/sort-contributors';
import { Contributor } from '@/types/explore-section/resources';
import { Contributor as ContributorEsProperty } from '@/types/explore-section/es-properties';

const resourcesData = [
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/fischer',
    '@type': ['Person', 'Agent'],
    familyName: 'Luca',
    givenName: 'Fischer',
  },
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/graf',
    '@type': ['Person', 'Agent'],
    name: 'Elena Graf',
  },
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/frey',
    '@type': 'Person',
  },
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/nico',
    '@type': 'Person',
    familyName: 'Schmid',
    givenName: 'Nico',
  },
  {
    '@id': 'https://www.grid.ac/institutes/grid.443970.d',
    '@type': ['Agent', 'Organization'],
    name: 'Janelia Research Campus',
  },
] as unknown as Array<Contributor>;

const esResourcesData = [
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/romani',
    '@type': ['http://schema.org/Person', 'http://www.w3.org/ns/prov#Agent'],
    affiliation: 'École Polytechnique Fédérale de Lausanne',
    idLabel: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/romani|Armando Romani',
    label: 'Armando Romani',
  },
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/frey',
    '@type': 'http://schema.org/Person',
    affiliation: 'École Polytechnique Fédérale de Lausanne',
    idLabel: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/frey|Mia Frey',
  },
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/nico',
    '@type': 'http://schema.org/Person',
    idLabel: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/nico|Nico Schmid',
    label: 'Nico Schmid',
  },
  {
    '@id': 'https://www.grid.ac/institutes/grid.443970.d',
    '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
    idLabel: 'https://www.grid.ac/institutes/grid.443970.d|Janelia Research Campus',
    label: 'Janelia Research Campus',
  },
  {
    '@id': 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/fischer',
    '@type': 'http://schema.org/Person',
    idLabel: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/fischer|Fischer Luca',
  },
] as unknown as Array<ContributorEsProperty>;

describe('Sort Contributors', () => {
  it('should sort contributors alphabetically by label', () => {
    const contributorA = { label: 'John' };
    const contributorB = { label: 'Alice' };

    const result = sortContributors(contributorA, contributorB);

    expect(result).toBe(1);
  });

  it('should handle contributors without labels', () => {
    const contributorA = {};
    const contributorB = { label: 'Alice' };

    const result = sortContributors(contributorA, contributorB);

    expect(result).toBe(-1);
  });
});

describe('Format Resource Contributors', () => {
  it('should return empty object when nothing passed', () => {
    const formattedContributor = formatContributors(null);

    expect(formattedContributor).toEqual({});
  });

  it('should return formatted resource contributor with family/given names properties', () => {
    const contributor = resourcesData.at(0);
    const formattedContributor = formatContributors(contributor as Contributor);

    expect(formattedContributor).toEqual({
      id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/fischer',
      type: ['Person', 'Agent'],
      label: 'Fischer Luca',
    });
  });

  it('should return formatted resource contributor with name property', () => {
    const contributor = resourcesData.at(1);
    const formattedContributor = formatContributors(contributor as Contributor);

    expect(formattedContributor).toEqual({
      id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/graf',
      type: ['Person', 'Agent'],
      label: 'Elena Graf',
    });
  });
});

describe('Format ES Resource Contributors', () => {
  it('should return empty object when nothing passed', () => {
    const formattedContributor = formatEsContributors(null);

    expect(formattedContributor).toEqual({});
  });

  it('should return formatted ES resource contributor when label exist', () => {
    const contributor = esResourcesData.at(0);
    const formattedContributor = formatEsContributors(contributor as ContributorEsProperty);

    expect(formattedContributor).toEqual({
      id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/romani',
      type: ['http://schema.org/Person', 'http://www.w3.org/ns/prov#Agent'],
      label: 'Armando Romani',
    });
  });

  it('should return formatted ES resource contributor when label not exist', () => {
    const contributor = esResourcesData.at(-1);
    const formattedContributor = formatEsContributors(contributor as ContributorEsProperty);

    expect(formattedContributor).toEqual({
      id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/fischer',
      type: 'http://schema.org/Person',
    });
  });
});

describe('normalizeContributors', () => {
  it('should return sorted resource contributors start by organization then people', () => {
    const contribuors = normalizeContributors<Contributor>(resourcesData, formatContributors);
    expect(contribuors).toEqual([
      {
        id: 'https://www.grid.ac/institutes/grid.443970.d',
        type: ['Agent', 'Organization'],
        label: 'Janelia Research Campus',
      },
      {
        id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/graf',
        type: ['Person', 'Agent'],
        label: 'Elena Graf',
      },
      {
        id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/fischer',
        type: ['Person', 'Agent'],
        label: 'Fischer Luca',
      },
      {
        id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/nico',
        type: 'Person',
        label: 'Nico Schmid',
      },
    ]);
  });

  it('should return sorted ES resource contributors start by organization then people', () => {
    const contribuors = normalizeContributors<ContributorEsProperty>(
      esResourcesData,
      formatEsContributors
    );
    expect(contribuors).toEqual([
      {
        id: 'https://www.grid.ac/institutes/grid.443970.d',
        type: ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
        label: 'Janelia Research Campus',
      },
      {
        id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/romani',
        type: ['http://schema.org/Person', 'http://www.w3.org/ns/prov#Agent'],
        label: 'Armando Romani',
      },
      {
        id: 'https://bbp.epfl.ch/nexus/v1/realms/bbp/users/nico',
        type: 'http://schema.org/Person',
        label: 'Nico Schmid',
      },
    ]);
  });
});
