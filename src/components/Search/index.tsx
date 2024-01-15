import { ReactElement, JSXElementConstructor } from 'react';
import { ConfigProvider, Select } from 'antd';
import { SelectProps, DefaultOptionType } from 'antd/es/select';
import { classNames } from '@/util/utils';

type SearchProps<T> = {
  className?: string;
  colorBgContainer?: string;
  onClear?: () => void;
  handleSelect: SelectProps['onSelect'];
  mode?: 'multiple' | 'tags';
  options: T[];
  placeholder?: string;
  tagRender?: (props: any) => ReactElement<any, string | JSXElementConstructor<any>>;
  value?: string[] | string;
  defaultValue?: string[] | string;
  useSearchInsteadOfFilter?: boolean;
  handleSearch?: SelectProps['onSearch'];
};

/**
 * A search input component that allows users to search and select from a list of options.
 *
 * @param {className?: string} className - CSS class name for the search input container.
 * @param {colorBgContainer?: string} colorBgContainer - Background color of the search input container.
 * @param {onClear?: () => void} onClear - Callback function to be called when the clear button is clicked.
 * @param {handleSelect: SelectProps['onSelect']} handleSelect - Callback function to be called when an option is selected.
 * @param {mode?: 'multiple' | 'tags'} mode - Set mode of Select.
 * @param {options: T[]} options - Array of options to be displayed in the search input.
 * @param {placeholder?: string} placeholder - Placeholder text for the search input.
 * @param {tagRender?: (props: any) => ReactElement<any, string | JSXElementConstructor<any>>} tagRender - Function to render the selected options.
 * @param {value?: string[] | string} value - Current value of the selected options.
 * @param {defaultValue?: string[] | string} defaultValue - Default value of the selected options.
 * @param {useSearchInsteadOfFilter?: boolean} useSearchInsteadOfFilter - Whether to use search prop instead of filter props when searching for options.
 * @param {onSearch?: SelectProps['onSearch']} onSearch - Callback function to be called when the search input is changed.
 */

export default function Search<T extends DefaultOptionType>({
  className,
  colorBgContainer = '#003A8C',
  onClear,
  handleSelect,
  mode,
  options,
  placeholder = 'Search',
  tagRender,
  value,
  defaultValue,
  handleSearch,
  useSearchInsteadOfFilter = false,
}: SearchProps<T>) {
  if (useSearchInsteadOfFilter && !handleSearch) {
    throw new Error('Search component use search prop but did not provide one');
  }

  return (
    <div className={classNames('border-b border-white', className)}>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer,
            colorBgElevated: '#003A8C', // Drop down list bg
            colorBorder: colorBgContainer, // Makes it "transparent"
            colorPrimary: 'white', // Seleced dropdown items color
            colorText: 'white', // Input value text
            colorTextSecondary: 'white', // Control item check mark
            colorTextTertiary: 'white', // Clear icon hover
            colorTextQuaternary: 'white', // Drop-down icon
            colorTextPlaceholder: '#69C0FF', // Input placeholder text
            controlItemBgActive: '#0050B3', // Selected dropdown items bg
            controlItemBgHover: '#096DD9',
          },
        }}
      >
        <Select
          showSearch
          allowClear
          autoClearSearchValue
          className="block w-full my-3 pl-0"
          dropdownStyle={{ borderRadius: '4px' }}
          placeholder={placeholder}
          onClear={onClear}
          onDeselect={handleSelect}
          onSelect={handleSelect}
          options={options}
          mode={mode}
          tagRender={tagRender}
          value={value}
          defaultValue={defaultValue}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(useSearchInsteadOfFilter
            ? { onSearch: handleSearch, filterOption: false }
            : {
                optionFilterProp: 'label',
                filterOption: (input: string, option?: T) =>
                  ((option?.label as string)?.toLowerCase() ?? '').includes(input.toLowerCase()),
                filterSort: (optionA: T, optionB: T) =>
                  ((optionA?.label as string).toLowerCase() ?? '').localeCompare(
                    (optionB?.label as string).toLowerCase() ?? ''
                  ),
              })}
        />
      </ConfigProvider>
    </div>
  );
}
