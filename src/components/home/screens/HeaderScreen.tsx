import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { basePath } from '@/config';
import { THREE_COLUMN_SCREEN_ONE } from '@/constants/home/content-home';

export function LargeButton() {
  return (
    <Link
      className="mt-10 flex h-auto w-[500px] justify-between rounded-none border border-primary-7 bg-transparent py-8 text-sm font-bold"
      href="/log-in"
      prefetch={false}
    >
      <span className="pl-4 text-4xl text-white">Log in</span>
      <ArrowRightOutlined className="pr-4 text-4xl text-white" />
    </Link>
  );
}

export default function HeaderScreen() {
  return (
    <div className="relative flex h-screen w-screen snap-start snap-always flex-col items-center justify-center px-[16vw] text-white">
      <h1 className="relative z-10 w-full font-title text-8xl font-bold">
        {'Virtual labs for\nexploring, building and\nsimulating the brain'}
      </h1>

      <div className="relative z-10 mt-10 grid w-full grid-cols-3 gap-x-4">
        {THREE_COLUMN_SCREEN_ONE.map((paragraph: string, index: number) => (
          <div
            className="flex flex-col gap-y-2 font-title text-xl font-normal"
            key={`Subtitle-${index + 1}`}
          >
            <div>{index + 1}</div>
            <h2>{paragraph}</h2>
          </div>
        ))}
      </div>

      <div className="absolute left-0 top-0 z-0 h-screen w-screen">
        <video autoPlay muted loop className="h-full w-full object-cover">
          <source src={`${basePath}/video/VIDEO_1ST-SCREEN_HOME-Compressed.mp4`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
