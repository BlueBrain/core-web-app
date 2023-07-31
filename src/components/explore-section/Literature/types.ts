type THighlightHits =  {
    start: number;
    end: number;
}
type TArticleItem = {
    id: string;
    title: string;
    url: string;
    authors: string[];
    journal: string;
    publishedDate: string;
    quotes: number;
    description: string;
    hits: THighlightHits[];
    categories?: string[];
}

type TExtractiveQAResponse = {
    answer: string;
    start: number;
    end: number;
    score: number;
    article_id: string;
    article_url: string;
    article_doi: string;
    article_title: string;
    article_authors: string[];
    article_abstract: string;
    article_quotes: number;
    section: string;
    paragraph: string;
}

export type {
    THighlightHits,
    TArticleItem,
    TExtractiveQAResponse,
}