'use client';

import React from 'react'
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import ExtraFilters from './ExtraFilters';

type TSearchComposeHeaderProps = {
    totalResults: number;
}

function SearchComposeHeader({ totalResults }: TSearchComposeHeaderProps) {
    const [open, setOpen] = React.useState(false);
    const toggleOpenFilterPanel = (value: boolean) => setOpen(value);

    return (
        <div>
            <ExtraFilters />
            <SearchBar {... {
                total: totalResults,
                openFilterPanel: toggleOpenFilterPanel,
            }} />
            <FilterPanel
                {... {
                    open,
                    closeFilterPanel: toggleOpenFilterPanel,
                }}
            />
        </div>
    )
}

export default SearchComposeHeader;