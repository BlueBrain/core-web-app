import { useCallback, useState, ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import data from './brain-regions.min.json';
import TreeNav from '@/components/TreeNavItem';
import { NavValue } from '@/state/brain-regions/types';
import { handleNavValueChange } from '@/components/BrainTree/util';
import { sectionAtom } from '@/state/application';

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

const pathToCorticalPlate = [
  'http://api.brain-map.org/api/v2/data/Structure/997',
  'http://api.brain-map.org/api/v2/data/Structure/8',
  'http://api.brain-map.org/api/v2/data/Structure/567',
  'http://api.brain-map.org/api/v2/data/Structure/688',
  'http://api.brain-map.org/api/v2/data/Structure/695',
]; // "695" is Cortical Plate
// "315" is the ID that corrosponds to Isocortex.
// In this example, it is attached to the trigger as the data-testid attribute.
const isocortex = 'http://api.brain-map.org/api/v2/data/Structure/315';

describe('The TreeNav implementation details using Brain Regions data', () => {
  test('Expanding the Isocortex nav item', async () => {
    // Context: TreeNav is expanded until Isocortex is rendered and selectable.
    // `value` is a tree, consising of only the expanded nav items.
    const defaulValue = {
      'http://api.brain-map.org/api/v2/data/Structure/997': {
        'http://api.brain-map.org/api/v2/data/Structure/8': {
          'http://api.brain-map.org/api/v2/data/Structure/567': {
            'http://api.brain-map.org/api/v2/data/Structure/688': {
              'http://api.brain-map.org/api/v2/data/Structure/695': null,
            },
          },
        },
      },
    }; // "695" is Cortical Plate

    // This mock function takes the place of brainRegionsNavValue or meTypeNavValue.
    const mockCallback = jest.fn((value: string[], path: string[]) => ({
      value,
      path,
    }));

    render(
      <TestProvider initialValues={[[sectionAtom, 'build']]}>
        <TreeNav items={data} value={defaulValue} onValueChange={mockCallback}>
          {({ id, content, title, trigger }) => (
            <TestNavItem id={id} content={content} trigger={trigger} title={title} />
          )}
        </TreeNav>
      </TestProvider>
    );

    await screen.findByTestId(isocortex);

    fireEvent.click(screen.getByTestId(isocortex));

    expect(mockCallback.mock.results[0].value).toStrictEqual({
      value: ['http://api.brain-map.org/api/v2/data/Structure/315'], // Isocortex
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
    render(
      <TestProvider initialValues={[[sectionAtom, 'build']]}>
        <StatefulTreeNav />
      </TestProvider>
    );

    // Expand nav all the way to (and including) Cortical Plate
    pathToCorticalPlate.forEach((id) => fireEvent.click(screen.getByTestId(id)));

    await screen.findByText('Isocortex');

    expect(screen.findByText('Isocortex')).toBeTruthy();
  });
});
