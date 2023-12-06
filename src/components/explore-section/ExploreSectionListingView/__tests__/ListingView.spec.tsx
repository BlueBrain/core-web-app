import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import {
  mockEmptyESResponse,
  mockMorphologyResponse,
} from '../../../../../__tests__/__server__/handlers';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
import sessionAtom from '@/state/session';
import HeaderPanel from '@/components/explore-section/ExploreSectionListingView/HeaderPanel';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';

jest.mock('next/navigation');

const testServer = setupServer(...[mockMorphologyResponse]);

// before all => start the test server
beforeAll(() => testServer.listen());
// after each => reset the handlers
afterEach(() => testServer.resetHandlers());
// after all => stop the test server
afterAll(() => testServer.close());

// mocking morphoviewer
jest.mock('morphoviewer', () => ({
  Morphoviewer: jest.fn(() => null),
}));

// mocking intersection observer, used in card view
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

function pressHideColumnButton() {
  const button = screen.getAllByRole('button', { name: 'filter-panel-hide-field-button' })[0];
  fireEvent.click(button);
}

function pressShowColumnButton() {
  const button = screen.getAllByRole('button', { name: 'filter-panel-show-field-button' })[0];
  fireEvent.click(button);
}

// TODO: The following components can be re-used in other test suites

export const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

export function TestProvider({ initialValues, children }: any) {
  return (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
  );
}

describe('Test main functionalities of interface', () => {
  beforeEach(() =>
    act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    )
  );

  test('default table view mode', () => {
    // if the table is not present, the getBy will fail
    screen.getByRole('table', { name: 'listing-view-table' });
  });

  test('changing screen to card view', () => {
    const tableViewButton = screen.getByRole('button', { name: 'card-view-button' });
    fireEvent.click(tableViewButton);
    screen.getByTestId('explore-section-listing-card-view');
  });
});

describe('Download button tests', () => {
  test('disabling download does not render checkboxes', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    );
    expect(screen.queryByLabelText('Select all')).toBeNull();
  });

  test('enabling download renders checkboxes', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
            enableDownload
          />
        </TestProvider>
      )
    );
    // if not visible the test will fail
    screen.getByLabelText('Select all');
  });

  test('By default download button is not visible', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
            enableDownload
          />
        </TestProvider>
      )
    );
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'download-resources-button' })).toBeNull()
    );
  });

  test('selecting row checkboxes shows the download button', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
            enableDownload
          />
        </TestProvider>
      )
    );
    // if not visible the test will fail
    const checkbox = screen.queryAllByRole('checkbox')[1];
    fireEvent.click(checkbox);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'download-resources-button' })).toBeVisible()
    );
  });
});

describe('Filters panel tests', () => {
  beforeEach(() =>
    act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    )
  );

  test('by default filter sidepanel is not visible', () => {
    const view = screen.queryByTestId('listing-view-control-panel');
    expect(view).toBeNull();
  });

  test('pressing filter button opens the filter panel', () => {
    const filterButton = screen.getByRole('button', { name: 'listing-view-filter-button' });
    fireEvent.click(filterButton);
    screen.getByTestId('listing-view-filter-panel');
  });

  test('pressing hide button hides a column', async () => {
    const filterButton = screen.getByRole('button', { name: 'listing-view-filter-button' });
    fireEvent.click(filterButton);
    const tableHeaderLengthBeforeHide = screen.getAllByRole('columnheader').length;
    pressHideColumnButton();
    const tableHeaderLengthAfterHide = screen.getAllByRole('columnheader').length;

    expect(tableHeaderLengthAfterHide).toEqual(tableHeaderLengthBeforeHide - 1);
  });

  test('pressing show button shows back the column', async () => {
    const filterButton = screen.getByRole('button', { name: 'listing-view-filter-button' });
    fireEvent.click(filterButton);
    const tableHeaderLengthBeforeHide = screen.getAllByRole('columnheader').length;
    pressHideColumnButton();
    pressShowColumnButton();
    const tableHeaderLengthAfterHide = screen.getAllByRole('columnheader').length;
    expect(tableHeaderLengthAfterHide).toEqual(tableHeaderLengthBeforeHide);
  });
});

describe('Header panel unit tests', () => {
  test('Header Panel shows the correct title', () => {
    render(
      <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
        <HeaderPanel
          title="Neuron Morphologies"
          experimentTypeName={NEURON_MORPHOLOGY}
          brainRegionSource="root"
        />
      </TestProvider>
    );
    const view = screen.getByRole('heading', { name: 'listing-view-title' });
    expect(view.textContent).toContain('Neuron Morphologies');
  });

  test('Header Panel with data shows correct totals', async () => {
    testServer.use(mockMorphologyResponse);

    render(
      <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
        <HeaderPanel
          title="Neuron Morphologies"
          experimentTypeName={NEURON_MORPHOLOGY}
          brainRegionSource="root"
        />
      </TestProvider>
    );

    const view = screen.getByRole('heading', { name: 'listing-view-title' });
    await waitFor(() => expect(view.textContent).toContain('Total:1,101'));
  });

  test('Header Panel without data shows 0 totals if no data', async () => {
    testServer.use(mockEmptyESResponse);

    render(
      <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
        <HeaderPanel experimentTypeName={NEURON_MORPHOLOGY} brainRegionSource="root" />
      </TestProvider>
    );
    const view = screen.getByRole('heading', { name: 'listing-view-title' });
    await waitFor(() => expect(view.textContent).toContain('Total:0'));
  });
});

describe('Load more resources button unit tests', () => {
  test('Load more resources button shows certain text', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    );
    const loadMoreButton = screen.getByRole('button', { name: 'load-more-resources-button' });
    expect(loadMoreButton.textContent).toEqual('Load 30 more results...');
  });

  test('Load more resources button shows text if no resources were returned', async () => {
    testServer.use(mockEmptyESResponse);
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    );
    const loadMoreButton = screen.getByRole('button', { name: 'load-more-resources-button' });
    expect(loadMoreButton.textContent).toEqual('All resources are loaded');
  });
});

describe('Listing view table tests', () => {
  test('table  all data rows without data', async () => {
    testServer.use(mockEmptyESResponse);

    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    );
    const tableRows = screen.getAllByRole('row');
    // 2 rows rendered: header and "no data" row
    expect(tableRows.length).toEqual(2);
  });

  test('table includes all data rows', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    );
    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toEqual(11);
  });

  test('table includes all columns', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            title="Neuron Morphologies"
            experimentTypeName={NEURON_MORPHOLOGY}
          />
        </TestProvider>
      )
    );
    const tableHeaders = screen.getAllByRole('columnheader');
    // +1 because it includes all columns plus the index/checkboxes
    expect(tableHeaders.length).toEqual(
      EXPERIMENT_DATA_TYPES[NEURON_MORPHOLOGY].columns.length + 1
    );
  });
});
