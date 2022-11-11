import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../src/pages/index';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /Welcome to the Swiss Brain Observatory/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
