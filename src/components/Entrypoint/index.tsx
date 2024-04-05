'use client';

import { Splash, Menu, ReleaseNotes } from './segments';

export default function Entrypoint() {
  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col p-5">
      <Splash />
      <Menu />
      <ReleaseNotes />
    </div>
  );
}
