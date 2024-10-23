'use client';

import ScreenOne from '../home/screens/ScreenOne';
import ScreenThree from '../home/screens/ScreenThree';
import ScreenTwo from '../home/screens/ScreenTwo';
import { AcceptInviteErrorDialog, Menu } from './segments';

export default function Entrypoint({ errorCode }: { errorCode?: string }) {
  return (
    <div className="relative flex w-screen flex-col bg-primary-9">
      <Menu />
      <div className="h-screen snap-y snap-mandatory overflow-x-hidden overflow-y-scroll">
        <ScreenOne />
        <ScreenTwo />
        <ScreenThree />
      </div>
      {errorCode && <AcceptInviteErrorDialog errorCode={errorCode} />}
    </div>
  );
}
