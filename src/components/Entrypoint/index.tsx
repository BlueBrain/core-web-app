'use client';

import { AcceptInviteErrorDialog, Menu, Splash } from './segments';

export default function Entrypoint({ errorCode }: { errorCode?: string }) {
  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col bg-primary-9">
      <Splash />
      <Menu />
      {errorCode && <AcceptInviteErrorDialog errorCode={errorCode} />}
    </div>
  );
}
