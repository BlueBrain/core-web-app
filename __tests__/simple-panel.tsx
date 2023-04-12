import { render } from '@testing-library/react';
import * as Navigation from 'next/navigation';
import SimplePanel from '../src/components/Home/panel/SimplePanel';

jest.mock('next/navigation');

Navigation.useSearchParams = jest.fn(() => new URLSearchParams());

test('Home page', async () => {
  render(
    <SimplePanel title="Explore" link="/explore">
      Text
    </SimplePanel>
  );

  // For now, we put a dummy test because the UI has not
  // yet been validated by Henry.
  expect(true).toBeTruthy();
});
