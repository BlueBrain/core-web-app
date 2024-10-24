'use client';

import Footer from '../AboutSFN/Blocs/Footer';
import HeaderScreen from '../home/screens/HeaderScreen';
import ScreenBBGithub from '../home/screens/ScreenBBGithub';
import ScreenContributors from '../home/screens/ScreenContributors';
import ScreenOpenData from '../home/screens/ScreenOpenData';
import { AcceptInviteErrorDialog, Menu } from './segments';

export default function Entrypoint({ errorCode }: { errorCode?: string }) {
  return (
    <div className="relative flex w-screen flex-col bg-primary-9">
      <Menu />
      <div className="h-screen snap-y snap-mandatory overflow-x-hidden overflow-y-scroll">
        <HeaderScreen />
        <ScreenBBGithub />
        <ScreenOpenData />
        <ScreenContributors />
        <Footer className="snap-start snap-always" />
      </div>
      {errorCode && <AcceptInviteErrorDialog errorCode={errorCode} />}
    </div>
  );
}
