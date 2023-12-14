import { AuthorSuggestionResponse } from '@/types/literature';

const createMockAuthor = (name: string) => ({
  name,
  docs_in_db: 1,
});

export const mockAuthors: AuthorSuggestionResponse = [
  createMockAuthor('Sterling Archer'),
  createMockAuthor('Lana Kane'),
  createMockAuthor('Cheryl Tunt'),
  createMockAuthor('Malory Archer'),
  createMockAuthor('Dr. Krieger'),
];
