/* eslint jsx-a11y/label-has-associated-control: "off" */

'use client';

import React, { useEffect, useState } from 'react';
import { LineChartOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Button } from 'antd';
import { atom, useAtomValue, useAtom } from 'jotai';
import { Session } from 'next-auth';
import sessionAtom from '@/state/session';
import { createResource, queryES } from '@/api/nexus';

export default function ExperimentAnalyses() {
  const [analyses, setAnalyses] = useAnalyses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const session = useAtomValue(sessionAtom);

  const onFinish = async (values: Analysis) => {
    if (!session) return;
    setLoading(true);
    await createResource(
      {
        '@context': ['https://bbp.neuroshapes.org'],
        '@type':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/AnalysisSoftwareSourceCode',
        ...values,
      },
      session
    );
    fetchAnalyses(session, (response: Analysis[]) => setAnalyses(response));
    setLoading(false);
    onCancel();
  };

  const onCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="min-h-screen bg-primary-8 overflow-auto p-4">
      <div className="text-2xl text-white font-bold mb-4">Experiment Analyses</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyses.map((item, i) => (
          <div key={item.codeRepository} className="border rounded-lg p-4 bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              <span className="mr-2 text-primary-8">
                <LineChartOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
              </span>
              {`Analysis ${i + 1}`}
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              <span className="block font-semibold">Git URL:</span>
              <a href={item.codeRepository} className="text-blue-500 hover:underline truncate">
                {item.codeRepository}
              </a>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Git Ref:</span>
              <span className="ml-2">{item.commit}</span>
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
        onClick={() => setIsModalVisible(true)}
        className="fixed bottom-4 right-4 bg-white hover:bg-blue-600 text-primary-8 hover:text-white py-2 px-4 rounded shadow-md"
        type="button"
        disabled={loading}
      >
        New Analysis
      </button>

      <Modal title="Analysis Form" open={isModalVisible} footer={null} onCancel={onCancel}>
        <Form
          form={form}
          name="analysisForm"
          initialValues={{ subdirectory: '' }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Code Repository"
            name="codeRepository"
            rules={[
              {
                required: true,
                message: 'Please input the code repository!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Command"
            name="command"
            rules={[
              {
                required: true,
                message: 'Please input the command!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Commit" name="commit">
            <Input placeholder="Optional" />
          </Form.Item>

          <Form.Item label="Branch" name="branch">
            <Input placeholder="Optional" />
          </Form.Item>

          <Form.Item
            label="Subdirectory"
            name="subdirectory"
            rules={[
              {
                required: true,
                message: 'Please input the subdirectory!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send Data
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// const response = await queryES<Analysis>(
//   {
//     query: {
//       bool: {
//         filter: [
//           { term: { _deprecated: false } },
//           { term: { '@type': 'SynapsePhysiologyModel' } },
//         ],
//       },
//     },
//   },
//   session
// );

interface Analysis {
  codeRepository: string;
  programmingLanguage: string;
  command: string;
  commit?: string;
  branch?: string;
  subdirectory: string;
}

const localAnalysesAtom = atom<Analysis[]>([]);

const fetchAnalyses = async (session: Session, onSuccess: (response: Analysis[]) => void) => {
  try {
    const response = await queryES<Analysis>(
      {
        query: {
          bool: {
            filter: [
              { term: { _deprecated: false } },
              { term: { '@type': 'AnalysisSoftwareSourceCode' } },
            ],
          },
        },
      },
      session
    );
    console.log(response);
    onSuccess(response);
  } catch (error) {
    console.error('Failed to fetch analyses:', error);
  }
};

function useAnalyses(): [Analysis[], (a: Analysis[]) => void] {
  const session = useAtomValue(sessionAtom);
  const [analyses, setAnalyses] = useAtom(localAnalysesAtom);

  useEffect(() => {
    if (!session) return;
    fetchAnalyses(session, (response: Analysis[]) => setAnalyses(response));
  }, [session, setAnalyses]);
  return [analyses, setAnalyses];
}
