'use client'

import { useSetAtom } from 'jotai';
import DefaultListView from '@/components/explore-section/ExploreSectionListingView';
import { typeAtom, triggerRefetchAtom, filtersAtom, resourceBasedRulesAtom } from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';
import {RuleWithOptionsProps} from '@/types/explore-section/kg-inference';

const TYPE = 'https://neuroshapes.org/NeuronMorphology';

export default function MorphologyListingPage({rulesWithOptions}: RuleWithOptionsProps) {
  useListPage({ typeAtom, triggerRefetchAtom, filtersAtom, TYPE });
    
  const setResourceBasedRules = useSetAtom(resourceBasedRulesAtom);

  console.log(rulesWithOptions);
  
  setResourceBasedRules(rulesWithOptions);

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <DefaultListView enableDownload title="Neuron morphology" />
    </div>
  );
}
