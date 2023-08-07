import React from 'react';
import { useAtomValue } from 'jotai';
import { literatureAtom } from '../state';


export default function QADefaultBrainRegion() {
    const { selectedBrainRegion } = useAtomValue(literatureAtom);
    if(!selectedBrainRegion) return  null
    return (
        <div>
            Selected Brain Region: {selectedBrainRegion.title}
        </div>
    )
}