'use client';

import { ChangeEvent, CSSProperties, ReactNode, useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import debounce from 'lodash/debounce';
import { Button, ConfigProvider, Input } from 'antd';
import { EditOutlined, UnlockOutlined } from '@ant-design/icons';
import Link from 'next/link';

import VirtualLabMainStatistics from '../VirtualLabMainStatistics';

import { basePath } from '@/config';
import useUpdateVirtualLab, { useUpdateProject } from '@/hooks/useUpdateVirtualLab';
import { useUnwrappedValue } from '@/hooks/hooks';
import useNotification from '@/hooks/notifications';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabTotalUsersAtom } from '@/state/virtual-lab/users';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';
import { classNames } from '@/util/utils';
import { generateLabUrl } from '@/util/virtual-lab/urls';

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

function useEditBtn() {
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
  description,
  name,
  onChange,
}: {
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
        defaultValue={name}
        maxLength={80}
        name="name"
        onChange={onChange}
        required
        style={{ background: 'rgba(255, 255, 255, 0.2)', height: 42 }}
        variant="borderless"
      />
      <Input.TextArea
        defaultValue={description}
        maxLength={80}
        name="description"
        onChange={onChange}
        rows={4}
        style={{ background: 'rgba(255, 255, 255, 0.2)', resize: 'none' }}
        variant="borderless"
      />
    </ConfigProvider>
  );
}

function StaticValues({ description, name }: { description?: string; name?: string }) {
  return (
    <>
      <span className="text-5xl font-bold">{name}</span>
      <p className="max-w-[768px]">{description}</p>
    </>
  );
}

function BannerWrapper({
  admin,
  children,
  createdAt,
  label,
  sessions,
  userCount,
}: {
  admin?: string;
  children: ReactNode;
  createdAt?: string;
  label: string;
  sessions?: string;
  userCount?: number;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex grow flex-col gap-2">
        <div className="text-primary-2">{label}</div>
        {children}
      </div>
      <div className="mt-auto">
        <VirtualLabMainStatistics
          admin={admin}
          createdAt={createdAt}
          sessions={sessions}
          userCount={userCount}
        />
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
          <StaticValues description={description} name={name} />
        </BannerWrapper>
      </Link>
    </BackgroundImg>
  );
}

export function SandboxBanner({ description, name }: Omit<Props, 'createdAt'>) {
  const totalUsers = useUnwrappedValue(virtualLabTotalUsersAtom);

  return (
    <BackgroundImg backgroundImage={hippocampusImg}>
      <div className={linkClassName}>
        <BannerWrapper label="Virtual lab Name" userCount={totalUsers}>
          <StaticValues description={description} name={name} />
        </BannerWrapper>
      </div>
    </BackgroundImg>
  );
}

export function LabDetailBanner({ createdAt, description, id, name }: Props & { id?: string }) {
  const users = useAtomValue(unwrap(virtualLabMembersAtomFamily(id)));

  const updateVirtualLab = useUpdateVirtualLab(id);
  const notify = useNotification();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    debounce(async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { target } = e;
      const fieldName = target.getAttribute('name');
      const { value } = target;

      return updateVirtualLab({ [fieldName as string]: value })
        .then(() => notify.success(`New Virtual lab ${fieldName}: "${value}"`))
        .catch(() =>
          notify.error(
            `Something went wrong when attempting to update the Virtual lab ${fieldName}.`
          )
        );
    }, 600),
    [notify, updateVirtualLab]
  );

  const { button: editBtn, isEditable } = useEditBtn();

  return (
    <BackgroundImg backgroundImage={hippocampusImg}>
      <div className={linkClassName}>
        <BannerWrapper
          admin={users?.find((user) => user.role === 'admin')?.name || '-'}
          createdAt={createdAt}
          label="Virtual lab Name"
          userCount={users?.length || 0}
        >
          {isEditable ? (
            <EditableInputs description={description} name={name} onChange={onChange} />
          ) : (
            <StaticValues description={description} name={name} />
          )}
        </BannerWrapper>
        {editBtn}
      </div>
    </BackgroundImg>
  );
}

export function ProjectDetailBanner({
  createdAt,
  description,
  name,
  projectId,
  virtualLabId,
}: Props & { projectId: string; virtualLabId: string }) {
  const users = useAtomValue(unwrap(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId })));

  const updateProject = useUpdateProject(virtualLabId, projectId);
  const notify = useNotification();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    debounce(async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { target } = e;
      const fieldName = target.getAttribute('name');
      const { value } = target;

      return updateProject({ [fieldName as string]: value })
        .then(() => notify.success(`New project ${fieldName}: "${value}"`))
        .catch(() =>
          notify.error(`Something went wrong when attempting to update the project ${fieldName}.`)
        );
    }, 600),
    [notify, updateProject]
  );

  const { button: editBtn, isEditable } = useEditBtn();

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
          sessions="N/A"
          userCount={users?.length || 0}
        >
          {isEditable ? (
            <EditableInputs description={description} name={name} onChange={onChange} />
          ) : (
            <StaticValues description={description} name={name} />
          )}
        </BannerWrapper>
        {editBtn}
      </div>
    </BackgroundImg>
  );
}
