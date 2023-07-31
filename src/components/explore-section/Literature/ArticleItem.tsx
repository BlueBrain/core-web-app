'use client';

import React from 'react';
import Link from 'next/link';
import { Tooltip } from 'antd';
import { PlusSquareOutlined, HeartFilled, CloseOutlined } from '@ant-design/icons';
import type { TArticleItem } from './types';
import { highlightHits } from './utils';
import PersonIcon from '@/components/icons/Person';
import JournalIcon from '@/components/icons/Journal';
import CalendarIcon from '@/components/icons/Calendar';
import QuoteIcon from '@/components/icons/Quote';
import { generateId } from '@/components/experiment-designer/GenericParamWrapper';


function ArticlePreview({ title, icon }: { title: string, icon: JSX.Element }) {
    return (
        <button
            type='button'
            className='flex items-center justify-center gap-1 text-base font-normal text-primary-8'
        >
            {icon}
            {title}
        </button>
    )
}
function ArticleAction({ title, icon, onClick }: { title: string, onClick: Function, icon: JSX.Element }) {
    return (
        <button
            type='button'
            onClick={() => onClick()}
            className='flex items-center justify-center gap-2 px-2 py-1 text-base font-normal transition-all ease-out rounded-md text-primary-8 hover:bg-gray-200'
        >
            <span> {title} </span>
            {icon}
        </button>
    )
}

function ArticleCategory({ category, clearable, onClear }: { category: string, clearable?: boolean, onClear?: Function }) {
    return (
        <button
            type='button'
            onClick={() => clearable && onClear && onClear()}
            className='inline-flex items-center justify-center gap-3 px-6 py-2 text-base font-normal capitalize bg-white border border-gray-200 rounded-full shadow-sm select-none text-primary-6'
        >
            <span>{category}</span>
            <span>{clearable && <CloseOutlined className='text-base font-thin hover:transform hover:scale-105 hover:transition-transform hover:ease-in-out hover:text-primary-7'/> }</span>
        </button>
    )
}

function ArticleCategories({ title, categories }: { title: string, categories?: string[] }) {
    return !!categories?.length && (
        <div className='flex flex-wrap items-center justify-start gap-2 my-2'>
            {
                categories.map((category) => {
                    const key = generateId(title, category);
                    return (
                        <ArticleCategory clearable key={key} category={category} />
                    )
                })
            }
        </div>
    )
}
export default function ArticleItem({
    title,
    url,
    authors,
    journal,
    publishedDate,
    quotes,
    description,
    hits,
    categories
}: TArticleItem) {
    return (
        <div className='my-10 last:mb-0 first:mt-0'>
            <div className='flex items-start justify-between'>
                <Link href={url}>
                    <h1 title={title} className='clear-right w-2/5 text-xl line-clamp-2 text-primary-8 hover:font-medium'>{title}</h1>
                </Link>
                <div className='grid grid-flow-col gap-4'>
                    <ArticleAction
                        title='Save'
                        onClick={() => console.log('save')}
                        icon={<HeartFilled />}
                    />
                    <ArticleAction
                        onClick={() => console.log('cite')}
                        title='Cite'
                        icon={<PlusSquareOutlined />}
                    />
                </div>
            </div>
            <div className='flex flex-wrap items-center gap-4 my-5'>
                <Tooltip
                    title='Authors'
                    placement='bottomLeft'
                    overlayInnerStyle={{ backgroundColor: 'white' }}
                    arrow={false}
                    overlay={(
                        <div className='flex flex-col gap-2'>
                            {
                                authors.map((author) => {
                                    const key = generateId(title, author)
                                    return (
                                        <div key={key} className='text-sm text-gray-900'>
                                            {author}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )}
                    trigger='hover'
                >
                    <div>
                        <ArticlePreview title={authors.at(0)!} icon={<PersonIcon />} />
                    </div>
                </Tooltip>
                <ArticlePreview title={journal} icon={<JournalIcon />} />
                <ArticlePreview title={publishedDate} icon={<CalendarIcon />} />
                <ArticlePreview title={`${quotes} times`} icon={<QuoteIcon />} />
            </div>
            <article className='bg-[#F5F5F5] p-7'
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: highlightHits({ description, hits }) }}
            />
            <ArticleCategories
                {... {
                    title,
                    categories,
                }}
            />
        </div>
    )
}