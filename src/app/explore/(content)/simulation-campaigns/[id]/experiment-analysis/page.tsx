/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRightOutlined, LineChartOutlined, RightOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Button } from 'antd';
import { useAtomValue } from 'jotai';
import { Session } from 'next-auth';
import Link from 'next/link';
import sessionAtom from '@/state/session';
import { createResource, fetchResourceById, queryES } from '@/api/nexus';
import usePathname from '@/hooks/pathname';
import { from64 } from '@/util/common';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import { useSession } from '@/hooks/hooks';

export default function ExperimentAnalyses() {
  const [analyses, setAnalyses] = useAnalyses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const session = useAtomValue(sessionAtom);
  const [search, setSearch] = useState('');
  const filteredAnalyses = useMemo(
    () =>
      analyses.filter(
        (a) =>
          a.name.toLocaleLowerCase().includes(search) ||
          a.description.toLocaleLowerCase().includes(search)
      ),
    [analyses, search]
  );

  const simCampaign = useFetchSimCampaign();

  const onFinish = async (values: Analysis) => {
    if (!session) return;
    setLoading(true);

    const configurationTemplate = await createResource(
      {
        '@context': ['https://bbp.neuroshapes.org'],
        '@type': 'ConfigurationTemplate',
      },
      session
    );

    await createResource(
      {
        '@context': ['https://bbp.neuroshapes.org'],
        '@type': 'AnalysisSoftwareSourceCode',
        ...values,
        codeRepository: {
          '@id': values.codeRepository,
        },
        configurationTemplate: {
          '@id': configurationTemplate['@id'],
          '@type': 'ConfigurationTemplate',
        },
        description: values.description ?? '',
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

  const pathname = usePathname();

  return (
    <div className="flex">
      <div className="stretch-self bg-neutral-1 text-primary-8 w-10 font-bold flex items-start justify-center">
        {simCampaign && (
          <Link
            className="whitespace-pre text-sm rotate-180 mt-5"
            href={
              pathname?.replace(/\/experiment-analysis$/, '') || '/explore/simulation-campaigns'
            }
            style={{ writingMode: 'vertical-rl' }}
          >
            {`Back to ${simCampaign?.name ?? 'simulation'}`}
            <ArrowRightOutlined className="mt-6" />
          </Link>
        )}
      </div>
      <div className="min-h-screen bg-white overflow-auto p-4 flex-1">
        <div className="flex justify-between">
          <div className="text-2xl text-primary-8 font-bold mb-4">Experiment Analyses</div>
          {!!analyses.length && (
            <div>
              <Input.Search
                style={{ width: 150 }}
                placeholder="Search"
                size="middle"
                onChange={(v) => setSearch(v.currentTarget.value)}
                allowClear
              />
              <button
                onClick={() => setIsModalVisible(true)}
                className="bg-white text-primary-8 py-2 px-4 shadow-md border border-primary-8 h-9 text-sm w-21 font-bold ml-2"
                type="button"
                disabled={loading}
              >
                Upload new
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnalyses.map((item) => (
            <AnalysisCard key={item['@id']} analysis={item} />
          ))}
        </div>

        <Modal title="Analysis Form" open={isModalVisible} footer={null} onCancel={onCancel}>
          <Form
            form={form}
            name="analysisForm"
            initialValues={{ subdirectory: '' }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input the name!',
                },
              ]}
            >
              <Input className="block" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input className="block" />
            </Form.Item>

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
              <Input className="block" />
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
              <div className="mt-2 float-right">
                <Button type="primary" onClick={onCancel} className="bg-white text-primary-8">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-primary-8 ml-3"
                >
                  Add Analysis
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

interface Analysis {
  '@id': string;
  codeRepository: { '@id': string };
  programmingLanguage: string;
  command: string;
  commit?: string;
  branch?: string;
  subdirectory: string;
  name: string;
  description: string;
}

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
    onSuccess(response);
  } catch (error) {
    throw new Error('Failed to fetch analyses');
  }
};

function useAnalyses(): [Analysis[], (a: Analysis[]) => void] {
  const session = useAtomValue(sessionAtom);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    if (!session) return;
    fetchAnalyses(session, (response: Analysis[]) => setAnalyses(response));
  }, [session, setAnalyses]);
  return [analyses, setAnalyses];
}

function useFetchSimCampaign() {
  const pathname = usePathname();
  const session = useSession();
  const [simCampaign, setSimCampaign] = useState<SimulationCampaignResource>();

  useEffect(() => {
    if (!pathname || !session) return;
    const parts = pathname?.split('/') || [];
    const key: string | undefined = from64(parts[parts.length - 2]);
    const data = key?.split('!/!');
    const id = data[data.length - 1];

    const fetch = async () => {
      const r = await fetchResourceById<SimulationCampaignResource>(id, session);
      setSimCampaign(r);
    };

    fetch();
  }, [pathname, session]);
  return simCampaign;
}

function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        <span className="mr-2 text-primary-8">
          <LineChartOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
        </span>
        {analysis.name}
      </h3>

      <div className="mt-2 text-sm text-gray-700">
        <p>{analysis.description}</p>
      </div>

      <div
        className="mt-2 flex justify-between cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="text-primary-8 font-bold">Details</div>
        <RightOutlined />
      </div>
      {showDetails && (
        <>
          <div className="mt-2 text-sm text-gray-700">
            <span className="block font-semibold">Git URL:</span>
            <a
              href={analysis.codeRepository['@id']}
              className="text-blue-500 hover:underline truncate"
            >
              {analysis.codeRepository['@id']}
            </a>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Git Ref:</span>
            <span className="ml-2">{analysis.commit}</span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Branch:</span>
            <span className="ml-2">{analysis.branch}</span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Subdirectory:</span>
            <span className="ml-2">{analysis.subdirectory}</span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Command:</span>
            <span className="ml-2">{analysis.command}</span>
          </div>
        </>
      )}
    </div>
  );
}
