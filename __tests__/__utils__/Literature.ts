import { AuthorSuggestionResponse, GArticle, JournalSuggestionResponse } from '@/types/literature';

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

export const getArticle = (id: number, extra: Partial<GArticle>): GArticle => {
  const randomId = getRandomID();
  return {
    id: `${id}`,
    doi: `doi - ${randomId}`,
    title: `Title ${randomId}`,
    authors: ['Malory Archer', 'Dr. Algernop Krieger'],
    journal: 'Kreiger experiments',
    paragraph:
      'The effects of the Krieger Kleanse are, as described, vivid "mind shredding" hallucinations, followed by a near-comatose state.',
    paragraphId: `paragraph ${randomId}`,
    section: 'The experiments are done in 3 stages: Pigley I, Pigley II, and Piggley III',
    abstract: 'Results of strong irradiation by plutonium rods on a pig',
    articleType: 'editorial notes',
    publicationDate: '2023-02-20',
    citationsCount: 2,
    impactFactor: 3,
    ...extra,
  };
};

const MIN_ID = 100;
const MAX_ID = 201;

// The maximum is exclusive and the minimum is inclusive
const getRandomID = (minId = MIN_ID, maxId = MAX_ID) => {
  const min = Math.ceil(minId);
  const max = Math.floor(maxId);
  return Math.floor(Math.random() * (max - min) + min);
};
