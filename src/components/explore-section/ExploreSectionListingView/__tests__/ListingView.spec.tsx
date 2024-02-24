import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import {
  mockEmptyESResponse,
  mockMorphologyResponse,
} from '../../../../../__tests__/__server__/handlers';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import sessionAtom from '@/state/session';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';

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

function pressHideColumnButton() {
  const button = screen.getAllByRole('button', { name: 'filter-panel-hide-field-button' })[0];
  fireEvent.click(button);
}

function pressShowColumnButton() {
  const button = screen.getAllByRole('button', { name: 'filter-panel-show-field-button' })[0];
  fireEvent.click(button);
}

// TODO: The following components can be re-used in other test suites

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

describe('Test main functionalities of interface', () => {
  beforeEach(() =>
    act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            dataType={DataType.ExperimentalNeuronMorphology}
          />
        </TestProvider>
      )
    )
  );

  test('table renders', () => {
    // if the table is not present, the getBy will fail
    screen.getByRole('table', { name: 'listing-view-table' });
  });
});

describe('Download button tests', () => {
  test('disabling download does not render checkboxes', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            dataType={DataType.ExperimentalNeuronMorphology}
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
            dataType={DataType.ExperimentalNeuronMorphology}
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
            dataType={DataType.ExperimentalNeuronMorphology}
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
            dataType={DataType.ExperimentalNeuronMorphology}
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
            dataType={DataType.ExperimentalNeuronMorphology}
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
    const tableHeaderLengthBeforeHide = screen.getAllByTestId('column-header').length;
    pressHideColumnButton();
    const tableHeaderLengthAfterHide = screen.getAllByTestId('column-header').length;

    expect(tableHeaderLengthAfterHide).toEqual(tableHeaderLengthBeforeHide - 1);
  });

  test('pressing show button shows back the column', async () => {
    const filterButton = screen.getByRole('button', { name: 'listing-view-filter-button' });
    fireEvent.click(filterButton);
    const tableHeaderLengthBeforeHide = screen.getAllByTestId('column-header').length;
    pressHideColumnButton();
    pressShowColumnButton();
    const tableHeaderLengthAfterHide = screen.getAllByTestId('column-header').length;
    expect(tableHeaderLengthAfterHide).toEqual(tableHeaderLengthBeforeHide);
  });
});

describe('Header panel unit tests', () => {
  test('Header Panel with data shows correct totals', async () => {
    testServer.use(mockMorphologyResponse);

    render(
      <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
        <NumericResultsInfo
          dataType={DataType.ExperimentalNeuronMorphology}
          brainRegionSource="root"
        />
      </TestProvider>
    );

    const view = screen.getByRole('status', { name: 'listing-view-title' });
    await waitFor(() => expect(view.textContent).toContain('Results 1,101'));
  });
});

describe('Load more resources button unit tests', () => {
  test("Load more resources button doesn't show up if there are no more resources", async () => {
    testServer.use(mockEmptyESResponse);
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            dataType={DataType.ExperimentalNeuronMorphology}
          />
        </TestProvider>
      )
    );
    const loadMoreButton = screen.queryByText('Load more');
    expect(loadMoreButton).toEqual(null);
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
            dataType={DataType.ExperimentalNeuronMorphology}
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
            dataType={DataType.ExperimentalNeuronMorphology}
          />
        </TestProvider>
      )
    );
    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toEqual(10);
  });

  test('table includes all columns', async () => {
    await act(() =>
      render(
        <TestProvider initialValues={[[sessionAtom, { accessToken: '123' }]]}>
          <ExploreSectionListingView
            brainRegionSource="root"
            dataType={DataType.ExperimentalNeuronMorphology}
          />
        </TestProvider>
      )
    );
    const tableHeaders = screen.getAllByTestId('column-header');
    expect(tableHeaders.length).toEqual(
      DATA_TYPES_TO_CONFIGS[DataType.ExperimentalNeuronMorphology].columns.length // Preview column has no header.
    );
  });
});
