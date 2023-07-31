'use client';

import React, { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { SearchOutlined, LoadingOutlined, CloseCircleOutlined, FilterOutlined } from '@ant-design/icons';
import useLiteratureAtom, { literatureAtom } from './state';
import { formatNumber } from './utils';

// function SortBy({

// }) {
//     return (
//         <div className='flex '>
//             Sort by:
//             <button
//                 type='button'
//                 className='px-2 py-1 text-base text-primary-8'
//             >

//             </button>
//         </div>
//     )
// }
type TSearchBarProps = {
    total: number;
    openFilterPanel(value: boolean): void;
}
export default function SearchBar({ total, openFilterPanel }: TSearchBarProps) {
    const pathName = usePathname();
    const update = useLiteratureAtom();
    const { replace } = useRouter();
    const { query } = useAtomValue(literatureAtom);
    const [isPending, startTransition] = useTransition();

    const handleSearch = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        update('query', value);
        const params = new URLSearchParams(window.location.search);
        if (query.length) {
            params.set('query', query);
        } else {
            params.delete('query');
        }
        startTransition(() => {
            replace(`${pathName}?${params.toString()}`);
        });
    }

    const onClear = () => {
        update('query', '');
        const params = new URLSearchParams(window.location.search);
        params.delete('query');
        startTransition(() => {
            replace(`${pathName}?${params.toString()}`);
        });
    }

    return (
        <div className='flex items-center w-full gap-5 py-3'>
            <form className='relative w-1/2 max-w-full'>
                <label htmlFor='query' >
                    <span className='text-base text-gray-500'>Search for</span>
                    <div className='flex items-center justify-between px-1 py-2 border-b border-primary-8'>
                        <input
                            id='query'
                            name='query'
                            type='text'
                            placeholder='search ...'
                            className='w-full text-base font-semibold text-primary-8 placeholder:text-sm placeholder-neutral-4 placeholder:font-light focus:outline-none'
                            value={query}
                            onChange={handleSearch}
                            autoComplete='off'
                        />
                        {isPending && <LoadingOutlined className='text-base text-primary-8' />}
                        {!isPending && !!query.length && <CloseCircleOutlined className='text-base text-primary-8' onClick={onClear} />}
                        {!isPending && !query.length && <SearchOutlined className='text-base text-primary-8' />}
                    </div>
                </label>
            </form>
            <div className='flex flex-col items-end justify-between h-full gap-2 ml-auto'>
                <button
                    type='button'
                    className='flex items-center gap-2 px-2 py-1 cursor-pointer'
                    onClick={() => openFilterPanel(true)}
                >
                    <span className='text-base text-primary-8'>Filter</span>
                    <span className='px-2 py-1 bg-gray-200 rounded-sm hover:bg-primary-8 group'><FilterOutlined className='text-primary-8 group-hover:text-white' /></span>
                </button>
                <div className='px-2 py-1 text-base text-primary-8'>
                    Results:
                    <span className='font-bold'>{formatNumber(total)}</span>
                </div>
            </div>
        </div>
    )
}