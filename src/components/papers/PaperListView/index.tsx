'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atomFamily, atomWithRefresh, unwrap } from 'jotai/utils';
import { Button, Form, Input, Modal, Table } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import isEqual from 'lodash/isEqual';
import { CheckCircleFilled, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';

import { createFile, createResource, queryES } from '@/api/nexus';
import { getPaperListQuery } from '@/queries/es';
import sessionAtom from '@/state/session';
import { DateISOString, PaperResource } from '@/types/nexus';
import { collapseId, createDistribution } from '@/util/nexus';
import { dateColumnInfoToRender } from '@/util/date';

// State

type PaperLocation = {
  virtualLabId: string;
  projectId: string;
};

const paperListAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: PaperLocation) =>
    atomWithRefresh<Promise<PaperResource[]>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return [];

      const query = getPaperListQuery(virtualLabId, projectId);
      return queryES<PaperResource>(query, session);
    }),
  isEqual
);

// Components

function CreatePaperSuccess({ name, startEditing }: { name: string; startEditing: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <CheckCircleFilled style={{ fontSize: '5rem', color: '#00B212' }} />
      <div className="w-full" style={{ padding: '.75rem 0 3.75rem' }}>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-base text-primary-8">You have successfully created new paper</p>
          <h2 className="text-2xl font-bold text-primary-8">{name}</h2>
          <p className="text-base text-primary-8"> and it is ready for use.</p>
        </div>
      </div>
      <Button
        type="primary"
        className="ml-2 inline-flex items-center justify-center rounded-none bg-primary-9 px-8 py-6"
        onClick={startEditing}
      >
        Start writing
      </Button>
    </div>
  );
}

interface CreatePaperFormProps {
  createPaperFn: (name: string, description: string, session: Session) => Promise<PaperResource>;
  onCreateSuccess: (createdPaper: PaperResource) => void;
  onClose: () => void;
}

type FormValidity = {
  name: boolean;
  description: boolean;
};

function CreatePaperForm({ createPaperFn, onCreateSuccess, onClose }: CreatePaperFormProps) {
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const [creatingState, setCreatingState] = useState<
    { status: 'stale' | 'creating'; data: null } | { status: 'success'; data: PaperResource }
  >({ status: 'stale', data: null });

  const [formValidity, setFormValidity] = useState<FormValidity>({
    name: false,
    description: false,
  });

  const formValid = formValidity.name && formValidity.description;

  const onValuesChange = useMemo(
    () =>
      debounce((changedValues: { name: string } | { description: string }) => {
        const changedProp = Object.keys(changedValues)[0];
        form
          .validateFields([changedProp])
          .then(() => setFormValidity({ ...formValidity, [changedProp]: true }))
          .catch(() => setFormValidity({ ...formValidity, [changedProp]: false }));
      }, 300),
    [form, formValidity]
  );

  const createPaper = async () => {
    setCreatingState({ status: 'creating', data: null });
    const { name, description } = form.getFieldsValue();
    const createdPaper = await createPaperFn(name, description, session as Session);
    setCreatingState({ status: 'success', data: createdPaper });
  };

  const startEditing = () => {
    if (creatingState.status === 'success') onCreateSuccess(creatingState.data);
    onClose();
  };

  // const nameValidatorFn = async (_: any, name: string) => {
  //   const isUniq = await checkNameIfUniq(getConfigByNameQueryFn, name.trim(), session as Session);

  //   if (isUniq) {
  //     return name;
  //   }

  //   throw new Error('Name should be unique');
  // };

  useEffect(() => {
    form.validateFields();
  }, [form]);

  if (creatingState.status !== 'success')
    return (
      <>
        <div className="flex flex-col items-start justify-start gap-y-3">
          <div className="inline-flex items-center gap-x-2">
            <PlusOutlined className="text-primary-8" />
            <h2 className="text-2xl font-bold text-primary-8">Create new paper</h2>
          </div>
          <p className="text-primary-8">
            You are about to create a new paper. You can now give it a name and start working on it.
          </p>
        </div>
        <Form
          className="mt-8"
          form={form}
          layout="vertical"
          autoComplete="off"
          onValuesChange={onValuesChange}
          validateTrigger={false}
          preserve={false}
          initialValues={{
            name: '',
            description: '',
          }}
        >
          <Form.Item
            id="name"
            name="name"
            label={<span className="text-base font-bold text-primary-8">Name</span>}
            rules={[
              { required: true, message: 'Please define a name' },
              // { validator: nameValidatorFn },
            ]}
          >
            <Input
              className="!focus:shadow-none mt-2 rounded-none border-0 border-b border-primary-8 text-xl"
              placeholder="Name your configuration..."
            />
          </Form.Item>
          <Form.Item
            id="description"
            name="description"
            label={<span className="text-base font-bold text-primary-8">Description</span>}
            rules={[{ required: true, message: 'Please define a description' }]}
          >
            <Input.TextArea
              rows={3}
              className="!focus:shadow-none mt-2 rounded-sm border border-neutral-3 text-base"
              placeholder="Write your description here..."
            />
          </Form.Item>

          <div className="mr-[-34px] mt-8 text-right">
            <Button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-none border-none px-5 py-6 shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="ml-2 inline-flex items-center justify-center rounded-none bg-primary-8 px-8 py-6"
              disabled={!formValid}
              onClick={createPaper}
              loading={creatingState.status === 'creating'}
            >
              Save
            </Button>
          </div>
        </Form>
      </>
    );

  return (
    <CreatePaperSuccess
      name={creatingState.data.name ?? form.getFieldsValue().name}
      startEditing={startEditing}
    />
  );
}

// Hooks
function useCreatePaperModal(virtualLabId: string, projectId: string) {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();
  const onClose = () => destroyRef?.current?.();

  const createPaperFn = useCallback(
    async (name: string, description: string, session: Session) => {
      const payloadMeta = await createFile(
        'null',
        'lexical-editor--state.json',
        'application/json',
        session
      );
      return createResource<PaperResource>(
        {
          '@context': ['https://bbp.neuroshapes.org'],
          '@type': ['Paper', 'Entity'],
          name,
          description,
          virtualLabId,
          projectId,
          tags: [],
          distribution: createDistribution(payloadMeta),
        },
        session
      );
    },
    [virtualLabId, projectId]
  );

  const createModal = (onCreateSuccess: (createdPaper: PaperResource) => void) => {
    const { destroy } = modal.confirm({
      title: null,
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 680,
      centered: true,
      mask: true,
      styles: {
        mask: { background: '#002766' },
        body: { padding: '60px 40px 20px' },
      },
      closeIcon: <CloseOutlined className="text-2xl text-primary-8" />,
      className: '![&>.ant-modal-content]:bg-red-500',
      content: (
        <CreatePaperForm
          createPaperFn={createPaperFn}
          onClose={onClose}
          onCreateSuccess={onCreateSuccess}
        />
      ),
    });

    destroyRef.current = destroy;

    return destroy;
  };

  return {
    createModal,
    // contextHolder: <ConfigProvider theme={modalTheme}>{contextHolder}</ConfigProvider>,
    contextHolder,
  };
}

// TODO deduplicate.
const dateRenderer = (createdAtStr: DateISOString) => {
  const dateColumnInfo = dateColumnInfoToRender(createdAtStr);
  if (!dateColumnInfo) return null;

  return <span title={dateColumnInfo.tooltip}>{dateColumnInfo.text}</span>;
};

const paperTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_name: string, paper: PaperResource) => (
      <Link
        href={`/virtual-lab/lab/${paper.virtualLabId}/project/${paper.projectId}/papers/${collapseId(paper['@id'])}`}
      >
        {paper.name}
      </Link>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Created by',
    dataIndex: '_createdBy',
    key: 'createdBy',
    render: (createdBy: string) => createdBy.split('/').at(-1),
  },
  {
    title: 'Date created',
    dataIndex: '_createdAt',
    key: 'description',
    render: dateRenderer,
  },
];

type PaperListViewProps = {
  virtualLabId: string;
  projectId: string;
};

export default function PaperListView({ virtualLabId, projectId }: PaperListViewProps) {
  const paperListAtom = paperListAtomFamily({ virtualLabId, projectId });

  const paperList = useAtomValue(useMemo(() => unwrap(paperListAtom, () => []), [paperListAtom]));
  // TODO Add loading state.
  const refreshPaperList = useSetAtom(paperListAtom);

  const router = useRouter();

  const { createModal, contextHolder } = useCreatePaperModal(virtualLabId, projectId);

  useEffect(() => {
    refreshPaperList();
  }, [refreshPaperList]);

  return (
    <div>
      <h3 className="text-xl">List of project papers</h3>

      <Table
        className="mt-8"
        columns={paperTableColumns}
        dataSource={paperList}
        rowKey="@id"
        locale={{ emptyText: 'No papers found' }}
      />

      <div className="text-right">
        <Button
          className="mt-8"
          icon={<PlusOutlined />}
          onClick={() =>
            createModal((createdPaper) => {
              refreshPaperList();

              const paperCollapsedId = collapseId(createdPaper['@id']);
              router.push(
                `/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers/${paperCollapsedId}`
              );
            })
          }
        >
          Create new paper
        </Button>
      </div>

      {contextHolder}
    </div>
  );
}
