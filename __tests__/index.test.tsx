import { render } from '@testing-library/react';
import * as NextAuthReact from 'next-auth/react';
import HomePage from '../src/app/page';

jest.mock('next-auth/react');

NextAuthReact.useSession = jest.fn(() => ({ data: null, status: 'loading' }));

test('Home page', async () => {
  render(<HomePage />);

  // For now, we put a dummy test because the UI has not
  // yet been validated by Henry.
  expect(true).toBeTruthy();
});
