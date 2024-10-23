'use client';

import ScreenOne from '../home/screens/ScreenOne';
import { AcceptInviteErrorDialog, Menu } from './segments';

export default function Entrypoint({ errorCode }: { errorCode?: string }) {
  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col bg-primary-9">
      <Menu />
      <ScreenOne />
      {errorCode && <AcceptInviteErrorDialog errorCode={errorCode} />}
    </div>
  );
}
