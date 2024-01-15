import { fireEvent, render } from '@testing-library/react';
import { selectOptions } from '../__utils__/searchOptions';
import Search from '@/components/Search';

const selectSearchInput = () => {
  const searchInput = document.querySelector("input[type='search']")!;
  fireEvent.click(searchInput);
  fireEvent.focus(searchInput);
  fireEvent.mouseDown(searchInput);
  return searchInput;
};

const queryString = 'topo';
const optionElementClassName = '.ant-select-item-option-content';

describe('SearchComponent', () => {
  describe('using Filter Props', () => {
    const { getAllByText, queryByText } = render(
      <Search
        onClear={jest.fn}
        handleSelect={jest.fn}
        options={selectOptions}
        placeholder="Search with filter"
      />
    );
    const searchInput = selectSearchInput();
    test('check filters result', () => {
      fireEvent.change(searchInput, { target: { value: queryString } });
      const options = document.querySelectorAll(optionElementClassName);
      // reason for 2 because of ANTD,
      // it create 2 nodes for every item one for selection and one for display
      expect(options).toHaveLength(2);
      expect(getAllByText('topography')).toHaveLength(2);
      expect(getAllByText('Brain topography')).toHaveLength(2);
      expect(queryByText('Human brain mapping (Print)')).toBeNull();
    });
  });

  describe('using Search Props', () => {
    test('check search component to throw an error if do not provide search component', () => {
      jest.spyOn(console, 'error').mockImplementation(() => null);
      expect(() =>
        render(
          <Search
            useSearchInsteadOfFilter
            onClear={jest.fn}
            handleSelect={jest.fn}
            options={selectOptions}
            placeholder="Search with filter"
          />
        )
      ).toThrow();
    });

    test('check the search component if you passed the search event callback', () => {
      render(
        <Search
          useSearchInsteadOfFilter
          onClear={jest.fn}
          handleSelect={jest.fn}
          options={selectOptions}
          placeholder="Search with filter"
          handleSearch={jest.fn}
        />
      );
      const searchInput = document.querySelector('input.ant-select-selection-search-input');
      expect(searchInput).toBeVisible();
    });
  });
});
