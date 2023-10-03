import React, { ReactElement, useState } from 'react';
import { Button } from 'antd';
import { PlusCircleOutlined, CloseOutlined, BranchesOutlined } from '@ant-design/icons';

function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAdvancedSearch = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative p-0 w-1/6 border rounded-lg">
      {!isOpen && (
        <Button
          className="flex h-16 bg-white center items-center text-center text-primary-9 border-none"
          icon={<PlusCircleOutlined className="pr-2" />}
          onClick={toggleAdvancedSearch}
        >
          Advanced Search
        </Button>
      )}
      {isOpen && (
        <div className="absolute top-[-2rem] p-4 mt-0 left-0 w-full bg-white border border-gray-300 rounded-lg z-20">
          <Button
            className="absolute top-2 right-2 text-primary-9 border-none"
            icon={<CloseOutlined />}
            onClick={toggleAdvancedSearch}
          />
          <Option
            title="Extend by Resource"
            description="Please use the plus icon on the left side of the table of the desired resource to view options"
            icon={<PlusCircleOutlined className="pr-2" />}
          />
          <Option
            title="Extend by Hierarchy"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            icon={<BranchesOutlined className="pr-2" />}
          />
        </div>
      )}
    </div>
  );
}

type OptionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

function Option({ title, description, icon }: OptionProps): ReactElement<OptionProps> {
  return (
    <div className="mb-4">
      <div className="text-blue-600">
        {icon}
        {title}
      </div>
      <div className="text-gray-500">{description}</div>
    </div>
  );
}

export default AdvancedSearch;
