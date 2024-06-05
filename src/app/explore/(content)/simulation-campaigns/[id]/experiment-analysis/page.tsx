/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRightOutlined, LineChartOutlined, RightOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Button } from 'antd';
import { useAtomValue } from 'jotai';

import Link from 'next/link';
import { fetchAnalyses, useAnalyses, Analysis } from '../../shared';
import sessionAtom from '@/state/session';
import { createResource, fetchResourceById } from '@/api/nexus';
import usePathname from '@/hooks/pathname';
import { from64 } from '@/util/common';
import { SimulationCampaign } from '@/types/explore-section/delta-simulation-campaigns';

import { useSessionAtomValue } from '@/hooks/hooks';

export default function ExperimentAnalyses({
  searchParams,
}: {
  searchParams?: { targetEntity?: string };
}) {
  const [analyses, setAnalyses] = useAnalyses(searchParams?.targetEntity);
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
        targetEntity: searchParams?.targetEntity,
      },
      session
    );

    fetchAnalyses(session, (response: Analysis[]) =>
      setAnalyses(response.filter((a) => a.targetEntity === searchParams?.targetEntity))
    );
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
      <div className="stretch-self flex w-10 items-start justify-center bg-neutral-1 font-bold text-primary-8">
        {simCampaign && (
          <Link
            className="mt-5 rotate-180 whitespace-pre text-sm"
            href={
              pathname?.replace(/\/experiment-analysis$/, '') || '/explore/simulation-campaigns'
            }
            style={{ writingMode: 'vertical-rl' }}
          >
            {`Back to ${simCampaign?.name ?? 'simulation'}`}
            <ArrowRightOutlined className="mt-6" />
          </Link>
        )}
        {!simCampaign && (
          <div
            className="mt-5 rotate-180 cursor-pointer whitespace-pre text-sm"
            style={{ writingMode: 'vertical-rl' }}
            onClick={() => window.history.back()}
          >
            Back to configuration
            <ArrowRightOutlined className="mt-6" />
          </div>
        )}
      </div>
      <div className="min-h-screen flex-1 overflow-auto bg-white p-4">
        <div className="flex justify-between">
          <div className="mb-4 text-2xl font-bold text-primary-8">Experiment Analyses</div>

          <div>
            <Input.Search
              style={{ width: 150 }}
              placeholder="Search"
              size="middle"
              onChange={(v) => setSearch(v.currentTarget.value.toLocaleLowerCase())}
              allowClear
            />
            <button
              onClick={() => setIsModalVisible(true)}
              className="w-21 ml-2 h-9 border border-primary-8 bg-white px-4 py-2 text-sm font-bold text-primary-8 shadow-md"
              type="button"
              disabled={loading}
            >
              Register New Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="float-right mt-2">
                <Button type="primary" onClick={onCancel} className="bg-white text-primary-8">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="ml-3 bg-primary-8"
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

function useFetchSimCampaign() {
  const pathname = usePathname();
  const session = useSessionAtomValue();
  const [simCampaign, setSimCampaign] = useState<SimulationCampaign>();

  useEffect(() => {
    if (!pathname || !session || pathname.includes('simulate')) return;

    const parts = pathname?.split('/') || [];
    const key: string | undefined = from64(parts[parts.length - 2]);
    const data = key?.split('!/!');
    const id: string | undefined = data[data.length - 1];

    if (!id) return;

    const fetch = async () => {
      const r = await fetchResourceById<SimulationCampaign>(id, session);
      setSimCampaign(r);
    };

    fetch();
  }, [pathname, session]);
  return simCampaign;
}

function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="self-start rounded-lg border bg-white p-4 shadow-md">
      <h3 className="mb-4 text-xl font-semibold">
        <span className="mr-2 text-primary-8">
          <LineChartOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
        </span>
        {analysis.name}
      </h3>

      <div className="mt-2 min-h-[25px] text-sm text-gray-700">
        <p>{analysis.description}</p>
      </div>

      <div
        className="mt-2 flex cursor-pointer justify-between"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="font-bold text-primary-8">Details</div>
        <RightOutlined />
      </div>
      {showDetails && (
        <>
          <div className="mt-2 text-sm text-gray-700">
            <span className="block font-semibold">Git URL:</span>
            <a
              href={analysis.codeRepository['@id']}
              className="truncate text-blue-500 hover:underline"
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
