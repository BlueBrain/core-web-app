'use client';

import { Splash, Menu, ReleaseNotes } from './segments';

export default function Entrypoint() {
  return (
    <div className="relative flex flex-col h-screen w-screen max-h-screen p-5">
      <Splash />
      <Menu />
      <ReleaseNotes />
    </div>
  );
}
