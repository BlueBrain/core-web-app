import React, { useState } from 'react';
import { Select, ConfigProvider } from 'antd';
import { BrainRegion } from '@/types/ontologies';
import { SimalirityModelsProps } from '@/constants/explore-section/kg-inference';

const { Option } = Select;

type InferenceRowProps = {
  label: string;
  placeholder: string;
  options?: BrainRegion[] | SimalirityModelsProps[] | null;
};

function InferenceRow({ label, placeholder, options }: InferenceRowProps) {
  const [selectedOption, setSelectedOption] = useState(placeholder);

  if (!options) return null;

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div className="mb-4 border border-primary-4">
      <div className="flex items-center px-2">
        <span className="mr-2">{label}</span>
        <div className="flex-grow">
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 0,
                borderRadiusLG: 0,
                borderRadiusSM: 0,
                borderRadiusXS: 0,
                colorBgContainer: '#002766',
                colorBgElevated: '#002766',
                controlItemBgHover: '#1890FF',
                colorIcon: '#fff',
                colorText: '#fff',
                colorBorder: 'none',
                controlOutlineWidth: 0,
                paddingXXS: 0,
              },
            }}
          >
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              placeholder={placeholder}
              className="w-full bg-transparent text-white"
            >
              {options.map((option) => (
                <Option key={option.id} value={option.title}>
                  {option.title}
                </Option>
              ))}
            </Select>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}

export default InferenceRow;
