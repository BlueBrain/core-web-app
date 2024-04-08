'use client';

import { Splash, Menu, ReleaseNotes, AcceptInviteErrorDialog } from './segments';

export default function Entrypoint({ errorCode }: { errorCode?: string }) {
  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col p-5">
      <Splash />
      <Menu />
      <ReleaseNotes />
      {errorCode && <AcceptInviteErrorDialog errorCode={errorCode} />}
    </div>
  );
}
