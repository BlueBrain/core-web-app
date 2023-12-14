import { AuthorSuggestionResponse, JournalSuggestionResponse } from '@/types/literature';

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

const createMockJournal = (title: string, index: number) => ({
  title,
  citescore: 1,
  eissn: `${index}`,
  print_issn: `${index}`,
});

export const mockJournals: JournalSuggestionResponse = [
  createMockJournal('Science', 1),
  createMockJournal('BioTech', 2),
  createMockJournal('NeuroScience', 3),
  createMockJournal('Biology', 4),
  createMockJournal('Botany', 5),
];

export const mockArticleResponse: { article_type: string; docs_in_db: number }[] = [
  { article_type: 'abstract', docs_in_db: 1 },
  { article_type: 'journal-paper', docs_in_db: 1 },
  { article_type: 'paper', docs_in_db: 1 },
];
