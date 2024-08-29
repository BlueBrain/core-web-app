import { RenderResult, act, cleanup, fireEvent, render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { useAtomValue } from 'jotai';

import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import ScopeSelector, { SimulationScope, items } from '@/components/VirtualLab/ScopeSelector';
import sessionAtom from '@/state/session';

function TestWrapper() {
  const session = useAtomValue(sessionAtom);

  return (
    <>
      <SessionProvider session={session}>
        <VirtualLabTopMenu />
      </SessionProvider>
      <ScopeSelector />
    </>
  );
}

describe('the ScopeSelector component', () => {
  let renderer: RenderResult;

  beforeEach(() => {
    renderer = render(<TestWrapper />);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a button for each simulation scope category', () => {
    const simScopeCategories = Object.keys(SimulationScope);

    const filterControls = renderer.getAllByLabelText((accessibleName) =>
      simScopeCategories.some((name) => accessibleName.match(name))
    );

    filterControls.forEach((control) => {
      expect(control).toBeVisible();
      if (control.title) {
        expect(control).toHaveTextContent(control.title);
      }
    });
  });

  it("applies the 'Cellular' filter by default", () => {
    const cellularScopesFilter = renderer.getByLabelText('Cellular');

    expect(cellularScopesFilter).toBeChecked();
  });

  it('renders the "cellular" scope buttons, and displays them by default', () => {
    const checkedScopeFilter = renderer.getByRole('radio', {
      checked: true,
      name: (accessibleName) => Object.keys(SimulationScope).includes(accessibleName),
    });

    act(async () => {
      fireEvent.click(checkedScopeFilter);
    }).then(() => {
      const cellularScopes = items.filter(({ scope }) => scope === 'cellular');

      const filteredScopeControls = renderer.getAllByLabelText((accessibleName) =>
        cellularScopes.some(({ title }) => accessibleName.match(title))
      );

      // Make sure that they are rendered
      filteredScopeControls.forEach((control) => {
        expect(control).toBeInTheDocument();
      });

      // Check that they are NOT yet hidden by the collapse feature
      filteredScopeControls.forEach((control) => {
        expect(control).toBeVisible();
      });
    });
  });

  it("'selects' the 'Single Neuron' scope by default", async () => {
    const cellularScopesFilter = renderer.getByLabelText('Cellular');

    await act(async () => {
      fireEvent.click(cellularScopesFilter);
    });

    const singleNeuronSelector = renderer.getByLabelText('Single Neuron');

    expect(singleNeuronSelector).toBeChecked();
  });

  it("renders the 'circuit' scope buttons after clicking on the 'circuit' filter button", async () => {
    const circuitFilterButton = renderer.getByLabelText('Circuit');

    await act(async () => {
      fireEvent.click(circuitFilterButton);
    });

    const circuitScopes = items.filter(({ scope }) => scope === 'circuit');

    const circuitScopeButtons = renderer.getAllByLabelText((accessibleName) =>
      circuitScopes.some(({ title }) => {
        return accessibleName.match(title);
      })
    );

    circuitScopeButtons.forEach((circuitScopeButton) => {
      expect(circuitScopeButton).toBeVisible();
    });
  });

  it('toggles the visibility of the available scope buttons when clicking on the "checked" scope filter', () => {
    const checkedScopeFilter = renderer.getByRole('radio', {
      checked: true,
      name: (accessibleName) => Object.keys(SimulationScope).includes(accessibleName),
    });

    act(async () => {
      fireEvent.click(checkedScopeFilter);
    }).then(() => {
      const cellularScopes = items.filter(({ scope }) => scope === 'cellular');

      const cellularScopeButtons = renderer.getAllByLabelText((accessibleName) =>
        cellularScopes.some(({ title }) => {
          return accessibleName.match(title);
        })
      );

      // Make sure that they are rendered
      cellularScopeButtons.forEach((scopeButton) => {
        expect(scopeButton).toBeInTheDocument();
      });

      // Check that they are visible
      cellularScopeButtons.forEach((scopeButton) => {
        expect(scopeButton).toBeVisible();
      });

      act(async () => {
        fireEvent.click(checkedScopeFilter);
      }).then(() => {
        // Check that the available scopes are HIDDEN (again)
        cellularScopeButtons.forEach((scopeButton) => {
          expect(scopeButton).not.toBeVisible(); // NOT!
        });
      });
    });
  });

  it("'selects' the desired scope when clicking on a scope selector", async () => {
    const circuitFilterControl = renderer.getByLabelText('Cellular');

    await act(async () => {
      fireEvent.click(circuitFilterControl);
    });

    const synaptomeControl = renderer.getByLabelText('Synaptome');

    await act(async () => {
      fireEvent.click(synaptomeControl);
    });

    expect(synaptomeControl).toBeChecked();
  });
});
