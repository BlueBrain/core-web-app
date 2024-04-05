'use client';

import { Suspense } from 'react';
import { Modal } from 'antd';
import { Splash, Menu, ReleaseNotes } from './segments';

export default function Entrypoint({ errorMessage }: { errorMessage?: string }) {
  console.log('MESSAGE', errorMessage);
  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col p-5">
      <Splash />
      <Menu />
      <ReleaseNotes />
    </div>
  );
}
