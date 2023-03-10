import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import Link from './index';

const useSearchParamsMockFn = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMockFn(),
}));

describe('Link component', () => {
  it('Should handle simple href', () => {
    useSearchParamsMockFn.mockReturnValue(new URLSearchParams());

    const { getByRole } = render(<Link href="/test" />);

    expect(getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('Should handle an href with search params', () => {
    useSearchParamsMockFn.mockReturnValue(new URLSearchParams());

    const { getByRole } = render(<Link href="/test?a=1&b=2" />);

    expect(getByRole('link')).toHaveAttribute('href', '/test?a=1&b=2');
  });

  it('Should be able to preserve location search params', () => {
    useSearchParamsMockFn.mockReturnValue(new URLSearchParams('a=1&b=2'));

    const { getByRole } = render(<Link href="/test" preserveLocationSearchParams />);

    expect(getByRole('link')).toHaveAttribute('href', '/test?a=1&b=2');
  });

  it('Should be able to preserve location search params when Link has its own search params', () => {
    useSearchParamsMockFn.mockReturnValue(new URLSearchParams('c=3&d=4'));

    const { getByRole } = render(<Link href="/test?a=1&b=2" preserveLocationSearchParams />);

    expect(getByRole('link')).toHaveAttribute('href', '/test?a=1&b=2&c=3&d=4');
  });

  it('Should be able to preserve location search params without overwriting those from href', () => {
    useSearchParamsMockFn.mockReturnValue(new URLSearchParams('b=4'));

    const { getByRole } = render(<Link href="/test?a=1&b=2" preserveLocationSearchParams />);

    expect(getByRole('link')).toHaveAttribute('href', '/test?a=1&b=2');
  });

  it('Should preserve only location search params listed in preservedSearchParamKeys prop', () => {
    useSearchParamsMockFn.mockReturnValue(new URLSearchParams('b=2&c=3&d=4'));

    const { getByRole } = render(
      <Link href="/test?a=1" preserveLocationSearchParams preservedSearchParamKeys={['b', 'c']} />
    );

    expect(getByRole('link')).toHaveAttribute('href', '/test?a=1&b=2&c=3');
  });
});
