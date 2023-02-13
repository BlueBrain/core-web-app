import { useCallback, useState, ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import data from './brain-regions.min.json';
import TreeNav, { NavValue } from '@/components/TreeNavItem';
import { handleNavValueChange } from '@/components/BrainRegionSelector/util';

/*
  The purpose of this file is to both test the TreeNav component,
  and also to demonstrate its usage.

  TestNavItem, below, is a component, similar to the ones that are
  used to render the Brain Regions navigation items, or the MeType
  composition items.
  It rendered by employing the "render-prop" pattern, which you can
  read about at the following URL:

  https://reactjs.org/docs/render-props.html
 */

/**
 * Renders the markup & content of a TreeNavItem.
 * @param {Object} args
 * @param {string} args.id - The identifier.
 * @param {string} args.title - The title text.
 * @param {string} args.trigger - A callback that returns the <Accordion.Trigger/>
 * @param {(...args: any[]) => ReactElement} args.content - A callback that returns the <Accordion.Content/>
 */
function TestNavItem({
  id,
  title,
  content,
  trigger,
}: {
  id: string;
  title: string;
  content: (...args: any[]) => ReactElement;
  trigger: (...args: any[]) => ReactElement;
}) {
  return (
    <div>
      <div>
        <span>{title}</span>
        {trigger?.({ 'data-testid': id })}
      </div>
      {/* content is used to position the render of the nested tree items */}
      {content?.()}
    </div>
  );
}

const pathToCorticalPlate = ['997', '8', '567', '688', '695']; // "695" is Cortical Plate
// "315" is the ID that corrosponds to Isocortex.
// In this example, it is attached to the trigger as the data-testid attribute.
const isocortex = 315;

describe('The TreeNav implementation details using Brain Regions data', () => {
  test('Expanding the Isocortex nav item', async () => {
    // Context: TreeNav is expanded until Isocortex is rendered and selectable.
    // `value` is a tree, consising of only the expanded nav items.
    const defaulValue = { '997': { '8': { '567': { '688': { '695': null } } } } }; // "695" is Cortical Plate

    // This mock function takes the place of brainRegionsNavValue or meTypeNavValue.
    const mockCallback = jest.fn((value: string[], path: string[]) => ({
      value,
      path,
    }));

    render(
      <TreeNav items={data} value={defaulValue} onValueChange={mockCallback}>
        {({ id, content, title, trigger }) => (
          <TestNavItem id={id} content={content} trigger={trigger} title={title} />
        )}
      </TreeNav>
    );

    await screen.findByTestId(isocortex);

    fireEvent.click(screen.getByTestId(isocortex));

    expect(mockCallback.mock.results[0].value).toStrictEqual({
      value: ['315'], // Isocortex
      path: pathToCorticalPlate,
    });
  });
});

function StatefulTreeNav() {
  const [brainRegionsNavValue, setNavValue] = useState<NavValue>(null);
  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(brainRegionsNavValue, setNavValue);

      return callback(newValue, path);
    },
    [brainRegionsNavValue, setNavValue]
  );

  return (
    <TreeNav items={data} value={brainRegionsNavValue} onValueChange={onValueChange}>
      {({ id, content, title, trigger }) => (
        <TestNavItem id={id} content={content} trigger={trigger} title={title} />
      )}
    </TreeNav>
  );
}

describe('A normal user interaction with TreeNav', () => {
  test('Expanding the navigation items', async () => {
    render(<StatefulTreeNav />);

    // Expand nav all the way to (and including) Cortical Plate
    pathToCorticalPlate.forEach((id) => fireEvent.click(screen.getByTestId(id)));

    await screen.findByText('Isocortex');

    expect(screen.findByText('Isocortex')).toBeTruthy();
  });
});
