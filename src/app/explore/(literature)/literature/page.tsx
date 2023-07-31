import React from 'react';
import { Session, getServerSession } from "next-auth";
import { ErrorBoundary } from 'react-error-boundary';
import { redirect } from 'next/navigation';
import { ArticleList, SearchComposeHeader, LiteratureErrors } from '@/components/explore-section/Literature';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { TArticleItem, TExtractiveQAResponse } from '@/components/explore-section/Literature/types';

type TLiteraturePageProps = {
    searchParams: {
        query?: string;
    };
};

const ArticleDTO = (article: TExtractiveQAResponse): TArticleItem => ({
    id: article.article_id,
    url: article.article_url,
    title: article.article_title,
    authors: article.article_authors,
    journal: article.article_doi,
    publishedDate: article.article_doi,
    quotes: article.article_quotes || 0,
    description: article.paragraph,
    hits: [{ start: article.start, end: article.end }]
});

type TFetchArticleInput = {
    query?: string;
    session: Session | null;
    page?: number;
    size?: number;
    hasNextPage?: boolean;
};

type TReturnFetchArcicles = (input: TFetchArticleInput) => Promise<TArticleItem[] | LiteratureErrors.LiteratureValidationError>;

const fetchArticles: TReturnFetchArcicles = async ({ query, session }) => {
    if (!query || !session) return Promise.resolve([]);
    try {
        const response = await fetch('https://ml.bbs.master.kcp.bbp.epfl.ch/extractive_qa', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({
                query,
                retriever_k: 10,
                reader_k: 10,
                reader_batch_size: 4
            })
        });
        const data = await response.json() as TExtractiveQAResponse[];
        return data.map(ArticleDTO);
    } catch (error: unknown) {
        console.error('@@Error Literature failed', error);
        if (error instanceof LiteratureErrors.LiteratureValidationError) {
            throw new LiteratureErrors.LiteratureValidationError(error.detail);
        }
        throw new Error((error as Error).message);
    }
}

export default async function LiteraturePage({ searchParams: { query } }: TLiteraturePageProps) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin");
    }
    // console.log('@@session', session);
    // const articles = await fetchArticles({
    //     query,
    //     session,
    // });
    const totalResults = 644_414;
    const articles: TArticleItem[] = [
        {
            "id": "10.1016/j.plrev.2014.04.005",
            'url': 'https://www.sciencedirect.com/science/article/pii/S1571064514000558',
            "title": "Toward a computational framework for cognitive biology: Unifying approaches from cognitive neuroscience and comparative cognition",
            "authors": [
                "Fitch, W. Tecumseh"
            ],
            "journal": "10.1016/j.plrev.2014.04.005",
            "publishedDate": "10.1016/j.plrev.2014.04.005",
            "quotes": 0,
            "description": "Progress in understanding cognition requires a quantitative, theoretical framework, grounded in the other natural sciences and able to bridge between implementational, algorithmic and computational levels of explanation. I review recent results in neuroscience and cognitive biology that, when combined, provide key components of such an improved conceptual framework for contemporary cognitive science. Starting at the neuronal level, I first discuss the contemporary realization that single neurons are powerful tree-shaped computers, which implies a reorientation of computational models of learning and plasticity to a lower, cellular, level. I then turn to predictive systems theory (predictive coding and prediction-based learning) which provides a powerful formal framework for understanding brain function at a more global level. Although most formal models concerning predictive coding are framed in associationist terms, I argue that modern data necessitate a reinterpretation of such models in cognitive terms: as model-based predictive systems. Finally, I review the role of the theory of computation and formal language theory in the recent explosion of comparative biological research attempting to isolate and explore how different species differ in their cognitive capacities. Experiments to date strongly suggest that there is an important difference between humans and most other species, best characterized cognitively as a propensity by our species to infer tree structures from sequential data. Computationally, this capacity entails generative capacities above the regular (finite-state) level; implementationally, it requires some neural equivalent of a push-down stack. I dub this unusual human propensity “dendrophilia”, and make a number of concrete suggestions about how such a system may be implemented in the human brain, about how and why it evolved, and what this implies for models of language acquisition. I conclude that, although much remains to be done, a neurally-grounded framework for theoretical cognitive science is within reach that can move beyond polarized debates and provide a more adequate theoretical future for cognitive biology.",
            "hits": [
                {
                    "start": 137,
                    "end": 214
                }
            ],
            'categories': ['biology', 'cognitive science']
        },
        {
            "id": "10.1016/j.plrev.2014.04.005",
            "url": 'https://www.sciencedirect.com/science/article/pii/S1571064514000558',
            "title": "Toward a computational framework for cognitive biology: Unifying approaches from cognitive neuroscience and comparative cognition",
            "authors": [
                // geneate another random author name
                "Fitch, W. Tecumseh",
                "Bila MEDDAH",
                'John Doe',
                'Jane Doe'
            ],
            "journal": "10.1016/j.plrev.2014.04.005",
            "publishedDate": "10.1016/j.plrev.2014.04.005",
            "quotes": 0,
            "description": "Progress in understanding cognition requires a quantitative, theoretical framework, grounded in the other natural sciences and able to bridge between implementational, algorithmic and computational levels of explanation. I review recent results in neuroscience and cognitive biology that, when combined, provide key components of such an improved conceptual framework for contemporary cognitive science. Starting at the neuronal level, I first discuss the contemporary realization that single neurons are powerful tree-shaped computers, which implies a reorientation of computational models of learning and plasticity to a lower, cellular, level. I then turn to predictive systems theory (predictive coding and prediction-based learning) which provides a powerful formal framework for understanding brain function at a more global level. Although most formal models concerning predictive coding are framed in associationist terms, I argue that modern data necessitate a reinterpretation of such models in cognitive terms: as model-based predictive systems. Finally, I review the role of the theory of computation and formal language theory in the recent explosion of comparative biological research attempting to isolate and explore how different species differ in their cognitive capacities. Experiments to date strongly suggest that there is an important difference between humans and most other species, best characterized cognitively as a propensity by our species to infer tree structures from sequential data. Computationally, this capacity entails generative capacities above the regular (finite-state) level; implementationally, it requires some neural equivalent of a push-down stack. I dub this unusual human propensity “dendrophilia”, and make a number of concrete suggestions about how such a system may be implemented in the human brain, about how and why it evolved, and what this implies for models of language acquisition. I conclude that, although much remains to be done, a neurally-grounded framework for theoretical cognitive science is within reach that can move beyond polarized debates and provide a more adequate theoretical future for cognitive biology.",
            "hits": [
                {
                    "start": 137,
                    "end": 192
                }
            ],
            'categories': ['biology', 'cognitive science']
        },
        {
            "id": "10.1016/j.plrev.2014.04.005",
            "url": 'https://www.sciencedirect.com/science/article/pii/S1571064514000558',
            "title": "Toward a computational framework for cognitive biology: Unifying approaches from cognitive neuroscience and comparative cognition",
            "authors": [
                "Fitch, W. Tecumseh"
            ],
            "journal": "10.1016/j.plrev.2014.04.005",
            "publishedDate": "10.1016/j.plrev.2014.04.005",
            "quotes": 0,
            "description": "Progress in understanding cognition requires a quantitative, theoretical framework, grounded in the other natural sciences and able to bridge between implementational, algorithmic and computational levels of explanation. I review recent results in neuroscience and cognitive biology that, when combined, provide key components of such an improved conceptual framework for contemporary cognitive science. Starting at the neuronal level, I first discuss the contemporary realization that single neurons are powerful tree-shaped computers, which implies a reorientation of computational models of learning and plasticity to a lower, cellular, level. I then turn to predictive systems theory (predictive coding and prediction-based learning) which provides a powerful formal framework for understanding brain function at a more global level. Although most formal models concerning predictive coding are framed in associationist terms, I argue that modern data necessitate a reinterpretation of such models in cognitive terms: as model-based predictive systems. Finally, I review the role of the theory of computation and formal language theory in the recent explosion of comparative biological research attempting to isolate and explore how different species differ in their cognitive capacities. Experiments to date strongly suggest that there is an important difference between humans and most other species, best characterized cognitively as a propensity by our species to infer tree structures from sequential data. Computationally, this capacity entails generative capacities above the regular (finite-state) level; implementationally, it requires some neural equivalent of a push-down stack. I dub this unusual human propensity “dendrophilia”, and make a number of concrete suggestions about how such a system may be implemented in the human brain, about how and why it evolved, and what this implies for models of language acquisition. I conclude that, although much remains to be done, a neurally-grounded framework for theoretical cognitive science is within reach that can move beyond polarized debates and provide a more adequate theoretical future for cognitive biology.",
            "hits": [
                {
                    "start": 141,
                    "end": 214
                }
            ],
            'categories': ['biology', 'cognitive science', 'neuroscience']
        },
        {
            "id": "10.1016/j.plrev.2014.04.005",
            'url': 'https://www.sciencedirect.com/science/article/pii/S1364661314000386',
            "title": "Toward a computational framework for cognitive biology: Unifying approaches from cognitive neuroscience and comparative cognition",
            "authors": [
                "Fitch, W. Tecumseh"
            ],
            "journal": "10.1016/j.plrev.2014.04.005",
            "publishedDate": "10.1016/j.plrev.2014.04.005",
            "quotes": 0,
            "description": "Progress in understanding cognition requires a quantitative, theoretical framework, grounded in the other natural sciences and able to bridge between implementational, algorithmic and computational levels of explanation. I review recent results in neuroscience and cognitive biology that, when combined, provide key components of such an improved conceptual framework for contemporary cognitive science. Starting at the neuronal level, I first discuss the contemporary realization that single neurons are powerful tree-shaped computers, which implies a reorientation of computational models of learning and plasticity to a lower, cellular, level. I then turn to predictive systems theory (predictive coding and prediction-based learning) which provides a powerful formal framework for understanding brain function at a more global level. Although most formal models concerning predictive coding are framed in associationist terms, I argue that modern data necessitate a reinterpretation of such models in cognitive terms: as model-based predictive systems. Finally, I review the role of the theory of computation and formal language theory in the recent explosion of comparative biological research attempting to isolate and explore how different species differ in their cognitive capacities. Experiments to date strongly suggest that there is an important difference between humans and most other species, best characterized cognitively as a propensity by our species to infer tree structures from sequential data. Computationally, this capacity entails generative capacities above the regular (finite-state) level; implementationally, it requires some neural equivalent of a push-down stack. I dub this unusual human propensity “dendrophilia”, and make a number of concrete suggestions about how such a system may be implemented in the human brain, about how and why it evolved, and what this implies for models of language acquisition. I conclude that, although much remains to be done, a neurally-grounded framework for theoretical cognitive science is within reach that can move beyond polarized debates and provide a more adequate theoretical future for cognitive biology.",
            "hits": [
                {
                    "start": 0,
                    "end": 96
                }
            ],
            'categories': ['biology', 'cognitive science', 'neuroscience', 'computational neuroscience']
        },
        {
            "id": "10.1016/j.plrev.2014.04.005",
            "url": 'https://www.sciencedirect.com/science/article/pii/S1571064514000558',
            "title": "Toward a computational framework for cognitive biology: Unifying approaches from cognitive neuroscience and comparative cognition",
            "authors": [
                "Fitch, W. Tecumseh"
            ],
            "journal": "10.1016/j.plrev.2014.04.005",
            "publishedDate": "10.1016/j.plrev.2014.04.005",
            "quotes": 0,
            "description": "Progress in understanding cognition requires a quantitative, theoretical framework, grounded in the other natural sciences and able to bridge between implementational, algorithmic and computational levels of explanation. I review recent results in neuroscience and cognitive biology that, when combined, provide key components of such an improved conceptual framework for contemporary cognitive science. Starting at the neuronal level, I first discuss the contemporary realization that single neurons are powerful tree-shaped computers, which implies a reorientation of computational models of learning and plasticity to a lower, cellular, level. I then turn to predictive systems theory (predictive coding and prediction-based learning) which provides a powerful formal framework for understanding brain function at a more global level. Although most formal models concerning predictive coding are framed in associationist terms, I argue that modern data necessitate a reinterpretation of such models in cognitive terms: as model-based predictive systems. Finally, I review the role of the theory of computation and formal language theory in the recent explosion of comparative biological research attempting to isolate and explore how different species differ in their cognitive capacities. Experiments to date strongly suggest that there is an important difference between humans and most other species, best characterized cognitively as a propensity by our species to infer tree structures from sequential data. Computationally, this capacity entails generative capacities above the regular (finite-state) level; implementationally, it requires some neural equivalent of a push-down stack. I dub this unusual human propensity “dendrophilia”, and make a number of concrete suggestions about how such a system may be implemented in the human brain, about how and why it evolved, and what this implies for models of language acquisition. I conclude that, although much remains to be done, a neurally-grounded framework for theoretical cognitive science is within reach that can move beyond polarized debates and provide a more adequate theoretical future for cognitive biology.",
            "hits": [
                {
                    "start": 121,
                    "end": 187
                }
            ],
            'categories': ['biology', 'cognitive science', 'neuroscience', 'computational neuroscience']
        },
        {
            "id": "10.1016/j.plrev.2014.04.005",
            "url": 'https://www.sciencedirect.com/science/article/pii/S1571064514000558',
            "title": "Toward a computational framework for cognitive biology: Unifying approaches from cognitive neuroscience and comparative cognition",
            "authors": [
                "Fitch, W. Tecumseh"
            ],
            "journal": "10.1016/j.plrev.2014.04.005",
            "publishedDate": "10.1016/j.plrev.2014.04.005",
            "quotes": 0,
            "description": "Progress in understanding cognition requires a quantitative, theoretical framework, grounded in the other natural sciences and able to bridge between implementational, algorithmic and computational levels of explanation. I review recent results in neuroscience and cognitive biology that, when combined, provide key components of such an improved conceptual framework for contemporary cognitive science. Starting at the neuronal level, I first discuss the contemporary realization that single neurons are powerful tree-shaped computers, which implies a reorientation of computational models of learning and plasticity to a lower, cellular, level. I then turn to predictive systems theory (predictive coding and prediction-based learning) which provides a powerful formal framework for understanding brain function at a more global level. Although most formal models concerning predictive coding are framed in associationist terms, I argue that modern data necessitate a reinterpretation of such models in cognitive terms: as model-based predictive systems. Finally, I review the role of the theory of computation and formal language theory in the recent explosion of comparative biological research attempting to isolate and explore how different species differ in their cognitive capacities. Experiments to date strongly suggest that there is an important difference between humans and most other species, best characterized cognitively as a propensity by our species to infer tree structures from sequential data. Computationally, this capacity entails generative capacities above the regular (finite-state) level; implementationally, it requires some neural equivalent of a push-down stack. I dub this unusual human propensity “dendrophilia”, and make a number of concrete suggestions about how such a system may be implemented in the human brain, about how and why it evolved, and what this implies for models of language acquisition. I conclude that, although much remains to be done, a neurally-grounded framework for theoretical cognitive science is within reach that can move beyond polarized debates and provide a more adequate theoretical future for cognitive biology.",
            "hits": [
                {
                    "start": 55,
                    "end": 96
                }
            ],
            'categories': ['biology', 'cognitive science', 'neuroscience', 'computational neuroscience', 'psychology']
        }
    ]
    return (
        <div className="relative flex flex-col w-full min-h-screen px-5 mx-auto bg-white max-w-7xl py-14">
            <SearchComposeHeader {... {
                totalResults,
            }} />
            <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
                <DefaultLoadingSuspense>
                    <ArticleList articles={articles as TArticleItem[]} />
                </DefaultLoadingSuspense>
            </ErrorBoundary>
        </div>
    )
}