'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import { TBrainRegion, literatureAtom } from './state';



function BrainRegionItem({ title }: TBrainRegion) {
    return (
        <div className='flex items-center justify-center px-6 py-2 font-semibold rounded-3xl bg-primary-0 text-primary-8'>
            {title}
        </div>
    )
}

export default function ExtraFilters() {
    const { brainRegions } = useAtomValue(literatureAtom);
    return (
        <div>
            <div className=''>You are searching a publication concerning:</div>
            <div className=''>
                {
                    brainRegions.map(({ id, title }: TBrainRegion) =>
                        <BrainRegionItem
                            key={id}
                            {... {
                                id, title
                            }}
                        />
                    )
                }
            </div>
        </div>
    )
}