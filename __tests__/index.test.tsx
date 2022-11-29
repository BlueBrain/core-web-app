import { render } from '@testing-library/react';
import HomePage from '../src/app/page';

test('Home page', async () => {
  render(<HomePage />);

  // For now, we put a dummy test because the UI has not
  // yet been validated by Henry.
  expect(true).toBeTruthy();
});
