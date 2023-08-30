'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import {
  experimentDataTypeAtom,
  triggerRefetchAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';
import { BOUTON_DENSITY } from '@/constants/explore-section/list-views';

export default function BoutonDensityListingPage() {
  useListPage({ experimentDataTypeAtom, triggerRefetchAtom, filtersAtom, TYPE: BOUTON_DENSITY });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView title="Bouton density" />
    </div>
  );
}
