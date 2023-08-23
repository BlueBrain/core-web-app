import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import QASettingsPanel from '@/components/explore-section/Literature/components/QASettingsPanel';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { literatureResultAtom } from '@/state/literature';
import { GenerativeQA } from '@/types/literature';
import { SelectedBrainRegion } from '@/state/brain-regions/types';

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
}));

describe('QASettingsPanel', () => {
  test('does not render setting elements when user is on non-build route', () => {
    renderComponent({ path: '/explore' });

    expect(searchInBrainRegionSwitch()).toEqual(null);
    expect(showOnlyBrainRegionQAsSwitch()).toEqual(null);
  });

  test('does not render setting elements when there are no QAs', () => {
    renderComponent({ path: '/build', qa: [] });

    expect(searchInBrainRegionSwitch()).toEqual(null);
    expect(showOnlyBrainRegionQAsSwitch()).toEqual(null);
  });

  test('renders setting elements when user is in build route and there is atleast 1 QA', () => {
    renderComponent({ path: '/build', qa: [mockQA()] });

    expect(searchInBrainRegionSwitch()).toBeVisible();
    expect(showOnlyBrainRegionQAsSwitch()).toBeVisible();
  });

  test('toggle for "search in all brain regions" is disabled and turned on when no brain region is selected', () => {
    renderComponent({ path: '/build', qa: [mockQA()] });
    const toggle = searchInBrainRegionSwitch();

    expect(toggle).not.toBeFalsy();
    expect(toggle!.getAttribute('aria-checked')).toEqual('true');
    expect(toggle!.getAttribute('disabled')).toEqual('');
  });

  test('toggle for "search in all brain regions" is enabled & turned off when a brain region is selected', () => {
    renderComponent({ path: '/build', qa: [mockQA()], brainRegion: { ...mockBrainRegion } });
    const toggle = searchInBrainRegionSwitch();

    expect(toggle).not.toBeFalsy();
    expect(toggle!.getAttribute('aria-checked')).toEqual('false');
    expect(toggle!.getAttribute('disabled')).toEqual(null);
  });

  test('toggle for "Show only current brain region questions" is disabled when no brain region is selected', () => {
    renderComponent({ path: '/build', qa: [mockQA()] });

    const toggle = showOnlyBrainRegionQAsSwitch();

    expect(toggle).toBeVisible();
    expect(toggle!.getAttribute('aria-checked')).toEqual('false');
    expect(toggle!.getAttribute('disabled')).toEqual('');
  });

  test('toggle for "Show only current brain region questions" is enabled when brain region is selected', () => {
    renderComponent({ path: '/build', qa: [mockQA()], brainRegion: mockBrainRegion });

    const toggle = showOnlyBrainRegionQAsSwitch();

    expect(toggle).toBeVisible();
    expect(toggle!.getAttribute('aria-checked')).toEqual('false');
    expect(toggle!.getAttribute('disabled')).toEqual(null);
  });

  const searchInBrainRegionSwitch = () => screen.queryByLabelText('Search in all brain regions');
  const showOnlyBrainRegionQAsSwitch = () =>
    screen.queryByLabelText('Show only current brain region questions');

  const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
  };

  function TestProvider({ initialValues, children }: any) {
    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </Provider>
    );
  }

  function QASettingsPanelProvider(qa: GenerativeQA[], brainRegion: SelectedBrainRegion | null) {
    return (
      <TestProvider
        initialValues={[
          [literatureResultAtom, qa],
          [selectedBrainRegionAtom, brainRegion],
        ]}
      >
        <QASettingsPanel />
      </TestProvider>
    );
  }

  const renderComponent = ({
    qa,
    brainRegion,
    path,
  }: {
    qa?: GenerativeQA[];
    brainRegion?: SelectedBrainRegion;
    path?: string;
  }) => {
    (usePathname as jest.Mock).mockReturnValue(path ?? null);
    render(QASettingsPanelProvider(qa ?? [], brainRegion ?? null));
  };

  const mockQA = (): GenerativeQA => ({
    id: '1',
    askedAt: new Date(),
    question: 'How many neurons are there in brain',
    answer: '10k',
    rawAnswer: 'blah blah blah',
    articles: [],
    isNotFound: false,
  });

  const mockBrainRegion: SelectedBrainRegion = {
    id: 'Abducens nucleus',
    title: 'Abducens nucleus',
    leaves: null,
    representedInAnnotation: true,
  };
});
