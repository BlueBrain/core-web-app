/* eslint jsx-a11y/label-has-associated-control: "off" */

'use client';

import React, { useEffect, useState } from 'react';
import { LineChartOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Button } from 'antd';
import { atom, useAtomValue, useAtom } from 'jotai';
import { Session } from 'next-auth';
import sessionAtom from '@/state/session';
import { createResource, queryES } from '@/api/nexus';
import launchWorkflowTask from '@/services/bbp-workflow';

const EXAMPLE_CFG = `
[DEFAULT]
account: proj30

kg-base: https://staging.nise.bbp.epfl.ch/nexus/v1
kg-org: bbp_test
kg-proj: studio_data3

[FindDetailedCircuitMeta]
config-url: https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/efc8d1c6-a3d4-462c-ada1-6b4e37667cc3?rev=1
[GenSimCampaignMeta]
config-url: https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/249e64ca-58fc-4d11-9c2d-b5bdbcc1dc9d?rev=2
[RunSimCampaignMeta]
config-url: https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/2bf23422-bea4-4478-9fc4-d05ac2238f7b?rev=1
[AnalyseSimCampaignMeta]
config-url: https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/2a25a1ff-733e-4f78-8654-0d7b0e156889?rev=4

[CloneGitRepo]
git_url: https://bbpgitlab.epfl.ch/nse/personal/ficarell/my-analysis.git
git_ref: main
subdirectory: src/a01
git_user: GUEST
git_password: WCY_qpuGG8xpKz_S8RNg
        `;

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
        '@type': 'AnalysisSoftwareSourceCode',
        ...values,
        codeRepository: {
          '@id': values.codeRepository,
        },
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
          <div
            key={item.codeRepository['@id']}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <h3 className="text-xl font-semibold mb-4">
              <span className="mr-2 text-primary-8">
                <LineChartOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
              </span>
              {`Analysis ${i + 1}`}
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              <span className="block font-semibold">Git URL:</span>
              <a
                href={item.codeRepository['@id']}
                className="text-blue-500 hover:underline truncate"
              >
                {item.codeRepository['@id']}
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

      <button
        type="button"
        onClick={async () => {
          const workflowExecutionUrl = await launchWorkflowTask({
            loginInfo: session,
            workflowName: 'bbp_workflow.sbo.analysis.task.AnalyseSimCampaignMeta/',
            workflowFiles: [
              {
                NAME: 'config.cfg',
                TYPE: 'file',
                CONTENT: EXAMPLE_CFG,
              },
              { NAME: 'cfg_name', TYPE: 'string', CONTENT: 'config.cfg' },
            ],
          });
          console.log(workflowExecutionUrl);
        }}
      >
        Workflow
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

interface Analysis {
  codeRepository: { '@id': string };
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
              {
                term: {
                  '@type': 'AnalysisSoftwareSourceCode',
                },
              },
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
