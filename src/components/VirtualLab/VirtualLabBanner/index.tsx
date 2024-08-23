'use client';

import { ChangeEvent, CSSProperties, ReactNode, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Button, ConfigProvider, Input } from 'antd';
import { EditOutlined, UnlockOutlined } from '@ant-design/icons';
import Link from 'next/link';

import VirtualLabMainStatistics from './VirtualLabMainStatistics';

import { basePath } from '@/config';
import { VirtualLab } from '@/types/virtual-lab/lab';
import useUpdateProject from '@/hooks/useUpdateVirtualLabProject';
import { useDebouncedCallback, useUnwrappedValue } from '@/hooks/hooks';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';
import { classNames } from '@/util/utils';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import { notification as notify } from '@/api/notifications';
import useUpdateVirtualLab from '@/hooks/useUpdateVirtualLab';
import styles from './virtual-lab-banner.module.css';

function BackgroundImg({
  backgroundImage,
  children,
  className,
  style,
}: {
  backgroundImage: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={classNames('relative min-h-[250px] overflow-hidden bg-primary-8', className)}>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage,
          ...style,
        }}
      />
      {children}
    </div>
  );
}

function useEditBtn({ dataTestid }: Partial<{ dataTestid: string }> = {}) {
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const onClick = () => setIsEditable(!isEditable);
  const button = (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            borderRadius: 0,
            colorPrimaryHover: '#fff',
            defaultGhostColor: '#69C0FF',
            defaultGhostBorderColor: '#69C0FF',
          },
        },
      }}
    >
      <Button
        ghost
        className="shrink-0 self-start"
        data-testid={dataTestid}
        icon={isEditable ? <UnlockOutlined /> : <EditOutlined />}
        onClick={onClick}
      />
    </ConfigProvider>
  );

  return {
    button,
    isEditable,
  };
}

function EditableInputs({
  dataTestid,
  description,
  name,
  onChange,
}: {
  dataTestid?: string;
  description?: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: { borderRadius: 0, colorText: '#fff', paddingBlock: 0, paddingInline: 0 },
        },
      }}
    >
      <Input
        className="text-5xl font-bold"
        data-testid={`${dataTestid}-name-input`}
        defaultValue={name}
        maxLength={250}
        name="name"
        onChange={onChange}
        required
        style={{ background: 'rgba(255, 255, 255, 0.2)', height: 42 }}
        variant="borderless"
      />
      <Input.TextArea
        className="grow"
        data-testid={`${dataTestid}-description-input`}
        defaultValue={description}
        maxLength={288}
        name="description"
        onChange={onChange}
        style={{ background: 'rgba(255, 255, 255, 0.2)', resize: 'none' }}
        variant="borderless"
      />
    </ConfigProvider>
  );
}

function StaticValues({
  dataTestid,
  description,
  name,
}: {
  dataTestid?: string;
  description?: string;
  name?: string;
}) {
  return (
    <>
      <span className="text-5xl font-bold" data-testid={`${dataTestid}-name-element`}>
        {name}
      </span>
      <p className="max-w-[768px]" data-testid={`${dataTestid}-description-element`}>
        {description}
      </p>
    </>
  );
}

function BannerWrapper({
  admin,
  children,
  createdAt,
  label,
  userCount,
}: {
  admin?: string;
  children?: ReactNode;
  createdAt?: string;
  label: string;
  userCount?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex grow flex-col gap-2">
        <div className="text-primary-2">{label}</div>
        {children}
      </div>
      <div className="mt-auto">
        <VirtualLabMainStatistics admin={admin} createdAt={createdAt} userCount={userCount} />
      </div>
    </div>
  );
}

const hippocampusImg = `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`;
const neocortexImg = `url(${basePath}/images/virtual-lab/obp_neocortex.webp)`;
const linkClassName = 'absolute left-0 top-0 flex h-full w-full justify-between p-8';

type Props = { createdAt?: string; description?: string; name?: string };

export function DashboardBanner({ createdAt, description, id, name }: Props & { id: string }) {
  const users = useAtomValue(unwrap(virtualLabMembersAtomFamily(id)));

  const labUrl = id && generateLabUrl(id);
  const href = `${labUrl}/overview`;

  return (
    <BackgroundImg backgroundImage={hippocampusImg} className="hover:brightness-110">
      <Link className={linkClassName} href={href}>
        <BannerWrapper
          admin={users?.find((user) => user.role === 'admin')?.name || '-'}
          createdAt={createdAt}
          label="Virtual lab Name"
          userCount={users?.length || 0}
        >
          <StaticValues description={description} name={name} dataTestid="dashboard-banner" />
        </BannerWrapper>
      </Link>
    </BackgroundImg>
  );
}

export function SandboxBanner({ description, name }: Omit<Props, 'createdAt'>) {
  return (
    <BackgroundImg backgroundImage={hippocampusImg}>
      <div className={linkClassName}>
        <BannerWrapper label="Virtual lab Name">
          <StaticValues description={description} name={name} dataTestid="sandbox-banner" />
        </BannerWrapper>
      </div>
    </BackgroundImg>
  );
}

export function LabDetailBanner({ vlab }: { vlab?: VirtualLab }) {
  const users = useUnwrappedValue(virtualLabMembersAtomFamily(vlab?.id));

  const updateVlab = useUpdateVirtualLab(vlab?.id);
  const updateDebounced = useDebouncedCallback(updateVlab, [updateVlab], 600);

  const name = vlab?.name;
  const description = vlab?.description;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target } = e;
    const fieldName = target.getAttribute('name');
    if (!fieldName || !vlab) return;

    const { value } = target;
    updateDebounced({ [fieldName]: value })?.catch((error) => notify.error(error.message));
  };

  const { button: editBtn, isEditable } = useEditBtn({ dataTestid: 'lab-detail-banner-edit-btn' });

  return (
    <BackgroundImg backgroundImage={hippocampusImg}>
      <div className={linkClassName}>
        <BannerWrapper
          admin={users?.find((user) => user.role === 'admin')?.name || '-'}
          createdAt={vlab?.created_at}
          label="Virtual lab Name"
          userCount={users?.length || 0}
        >
          {isEditable ? (
            <EditableInputs
              description={description}
              name={name}
              onChange={onChange}
              dataTestid="lab-detail-banner"
            />
          ) : (
            <StaticValues description={description} name={name} dataTestid="lab-detail-banner" />
          )}
        </BannerWrapper>
        {editBtn}
      </div>
    </BackgroundImg>
  );
}

function getErrorMsg(fieldName: string) {
  return `Something went wrong when attempting to update the project ${fieldName}.`;
}

export function getSuccessMsg(fieldName: string, value: string) {
  return `New project ${fieldName}: "${value}"`;
}

export const dataTestid = 'edit-project-info';

export function ProjectDetailBanner({
  createdAt,
  description,
  name,
  projectId,
  virtualLabId,
}: Props & { projectId: string; virtualLabId: string }) {
  const users = useAtomValue(unwrap(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId })));

  const updateProject = useUpdateProject(virtualLabId, projectId);

  const onChange = useDebouncedCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { target } = e;
      const fieldName = target.getAttribute('name');
      const { value } = target;

      return (
        !!fieldName &&
        updateProject({ [fieldName as string]: value })
          .then(() => notify.success(getSuccessMsg(fieldName, value)))
          .catch(() => notify.error(getErrorMsg(fieldName)))
      );
    },
    [updateProject],
    600,
    { leading: true }
  );

  const { button: editBtn, isEditable } = useEditBtn({
    dataTestid,
  });

  return (
    <BackgroundImg
      backgroundImage={neocortexImg}
      style={{
        backgroundSize: '50%',
        backgroundPosition: '-5% 20%',
        rotate: '215deg',
        top: '-100%',
        right: '-20%',
        left: 'auto',
        opacity: 'unset',
        mixBlendMode: 'unset',
      }}
    >
      <div className={linkClassName}>
        <BannerWrapper
          admin={users?.find((user) => user.role === 'admin')?.name || '-'}
          createdAt={createdAt}
          label="Project Name"
          userCount={users?.length || 0}
        >
          {isEditable ? (
            <EditableInputs
              dataTestid={dataTestid}
              description={description}
              name={name}
              onChange={onChange}
            />
          ) : (
            <StaticValues dataTestid={dataTestid} description={description} name={name} />
          )}
        </BannerWrapper>
        {editBtn}
      </div>
    </BackgroundImg>
  );
}
