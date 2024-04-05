'use client';

import { Suspense, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Splash, Menu, ReleaseNotes } from './segments';
import isNil from 'lodash/isNil';

export default function Entrypoint({ inviteErrorCode }: { inviteErrorCode?: string | null }) {
  const [isOpen, setIsOpen] = useState<boolean>(!!inviteErrorCode);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);
  console.log('INVITE RRROR CODE', inviteErrorCode, isOpen);
  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col p-5">
      <Splash />
      <Menu />
      <ReleaseNotes />
      {isLoading ? (
        <Modal open={isOpen} maskClosable onCancel={() => setIsOpen(false)} footer={null}>
          {inviteErrorCode}
        </Modal>
      ) : null}
    </div>
  );
}
