/* eslint jsx-a11y/label-has-associated-control: "off" */

'use client';

import React, { useState } from 'react';
import { LineChartOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';

function FullViewportDiv() {
  const analysisData = [
    {
      title: 'Analysis 1',
      description: 'Description for Analysis 1',
      git_url: 'https://github.com/repo1',
      git_ref: 'main',
      subdirectory: 'subdir1',
      command: 'echo "Hello World"',
    },
    {
      title: 'Analysis 2',
      description: 'Description for Analysis 2',
      git_url: 'https://github.com/repo2',
      git_ref: 'dev',
      subdirectory: 'subdir2',
      command: 'echo "Hello World"',
    },
    {
      title: 'Analysis 3',
      description: 'Description for Analysis 3',
      git_url: 'https://github.com/repo3',
      git_ref: 'feature-branch',
      subdirectory: 'subdir3',
      command: 'echo "Hello World"',
    },
    {
      title: 'Analysis 4',
      description: 'Description for Analysis 4',
      git_url: 'https://github.com/repo4',
      git_ref: 'release',
      subdirectory: 'subdir4',
      command: 'echo "Hello World"',
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-primary-8 overflow-auto p-4">
      <div className="text-2xl text-white font-bold mb-4">Experiment Analyses</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysisData.map((item) => (
          <div key={item.git_url} className="border rounded-lg p-4 bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              <span className="mr-2 text-primary-8">
                <LineChartOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
              </span>
              {item.title}
            </h3>
            <p className="mb-4 text-gray-600">{item.description}</p>
            <div className="mt-2 text-sm text-gray-700">
              <span className="block font-semibold">Git URL:</span>
              <a href={item.git_url} className="text-blue-500 hover:underline truncate">
                {item.git_url}
              </a>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Git Ref:</span>
              <span className="ml-2">{item.git_ref}</span>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Subdirectory:</span>
              <span className="ml-2">{item.subdirectory}</span>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Command:</span>
              <span className="ml-2">{item.command}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={showModal}
        className="fixed bottom-4 right-4 bg-white hover:bg-blue-600 text-primary-8 hover:text-white py-2 px-4 rounded shadow-md"
        type="button"
      >
        New Analysis
      </button>

      <Modal title="Add New Analysis" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <Input placeholder="Enter analysis title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Input placeholder="Enter analysis description" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Git URL</label>
            <Input placeholder="https://github.com/repo" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Git Ref</label>
            <Input placeholder="Enter git ref (e.g., main, dev)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subdirectory</label>
            <Input placeholder="Enter subdirectory name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Command</label>
            <Input placeholder='echo "Hello World"' />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FullViewportDiv;
