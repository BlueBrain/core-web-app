import React from 'react'
import ArticleItem from "./ArticleItem";
import type { TArticleItem } from './types';


type TArticleListProps = {
    articles: TArticleItem[];
}

export default function ArticleList({ articles }: TArticleListProps) {
    return (
        <div className='mt-10'>
            {articles.map(({ url, authors, description, id, journal, publishedDate, quotes, title, hits, categories }) => (
                <ArticleItem
                    key={id}
                    {... {
                        id,
                        url, 
                        title,
                        authors,
                        description,
                        journal,
                        publishedDate,
                        quotes,
                        hits,
                        categories,
                    }}
                />
            )
            )}
        </div>
    )
}
