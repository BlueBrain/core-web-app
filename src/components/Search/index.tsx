import { ReactElement, JSXElementConstructor } from 'react';
import { ConfigProvider, Select } from 'antd';
import { SelectProps, DefaultOptionType } from 'antd/es/select';
import { classNames } from '@/util/utils';

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
}: {
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
}) {
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
          allowClear
          autoClearSearchValue
          className="block w-full my-3 pl-0"
          dropdownStyle={{ borderRadius: '4px' }}
          placeholder={placeholder}
          onClear={onClear}
          onDeselect={handleSelect}
          onSelect={handleSelect}
          options={options}
          filterOption={(input, option) =>
            ((option?.label as string)?.toLowerCase() ?? '').includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            ((optionA?.label as string).toLowerCase() ?? '').localeCompare(
              (optionB?.label as string).toLowerCase() ?? ''
            )
          }
          mode={mode}
          optionFilterProp="label"
          showSearch
          tagRender={tagRender}
          value={value}
          defaultValue={defaultValue}
        />
      </ConfigProvider>
    </div>
  );
}
