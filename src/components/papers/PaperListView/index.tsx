'use client';

import { Button, ConfigProvider, Table } from 'antd';
import Link from 'next/link';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { CheckOutlined } from '@ant-design/icons';
import delay from 'lodash/delay';

import { PaperResource } from '@/types/nexus';
import { CopyIconOutline } from '@/components/icons/CopyIcon';
import { EditIconOutline } from '@/components/icons/Edit';
import { EyeIconOutline } from '@/components/icons/EyeIcon';
import { paperHrefGenerator } from '@/services/paper-ai/utils';
import { to64 } from '@/util/common';
import { useCopyToClipboard } from '@/hooks/useCopyClipboard';

type PaperListViewProps = {
  papers: Array<PaperResource>;
  total: number;
};

export default function PaperListView({ papers, total }: PaperListViewProps) {
  const { push: redirect } = useRouter();
  const [copiedPaper, copyPaper, resetCopy] = useCopyToClipboard();

  const onEdit = (paper: PaperResource) => () => {
    redirect(`${paperHrefGenerator(paper)}?mode=edit`);
  };

  const onCopy = (paper: PaperResource) => async () => {
    await copyPaper(`${window.location}/${to64(paper['@id'])}`);
    delay(resetCopy, 1000);
  };

  const onView = (paper: PaperResource) => () => redirect(paperHrefGenerator(paper));

  const columns: ColumnsType<PaperResource> = [
    {
      key: 'name',
      title: 'Title',
      dataIndex: 'name',
      width: '50%',
      render: (_name: string, paper: PaperResource) => (
        <Link href={paperHrefGenerator(paper)} className="line-clamp-1 font-bold text-primary-8">
          {paper.name}
        </Link>
      ),
    },
    {
      key: 'createdBy',
      title: 'Created by',
      dataIndex: '_createdBy',
      width: 'max-content',
      render: (createdBy: string) => (
        <div className="text-primary-8">{createdBy.split('/').at(-1)}</div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date created',
      dataIndex: '_createdAt',
      width: 'max-content',
      render: (value) => (
        <span>{new Intl.DateTimeFormat('fr-FR').format(new Date(value)).replace(/\//g, '.')}</span>
      ),
    },
    {
      key: 'actions',
      width: 'max-content',
      render: (_, paper) => {
        const paperUrl = `${window.location}/${to64(paper['@id'])}`;
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              size="small"
              htmlType="button"
              type="link"
              icon={
                copiedPaper === paperUrl ? (
                  <CheckOutlined className="text-teal-600" />
                ) : (
                  <CopyIconOutline />
                )
              }
              onClick={onCopy(paper)}
            />
            <Button
              size="small"
              htmlType="button"
              type="link"
              icon={<EyeIconOutline />}
              onClick={onView(paper)}
            />
            <Button
              size="small"
              htmlType="button"
              type="link"
              icon={<EditIconOutline />}
              onClick={onEdit(paper)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full py-2">
      <h3 className="text-3xl font-bold text-primary-8">
        <span className="mr-2">Your papers</span>
        <span className="text-lg font-normal">({total})</span>
      </h3>
      {!papers.length ? (
        <p className="mt-4 text-lg font-light text-neutral-4">You have no paper yet.</p>
      ) : (
        <ConfigProvider
          theme={{
            hashed: false,
            components: {
              Table: {
                headerColor: '#8C8C8C',
                headerBg: 'transparent',
                headerSplitColor: 'transparent',
              },
            },
          }}
        >
          <Table
            size="small"
            className="mt-8"
            columns={columns}
            dataSource={papers}
            rowKey="@id"
            scroll={{ y: 300 }}
          />
        </ConfigProvider>
      )}
    </div>
  );
}
