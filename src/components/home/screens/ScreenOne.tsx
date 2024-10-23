import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

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

export default function ScreenOne() {
  return (
    <div className="relative z-10 flex h-screen w-screen flex-col items-center justify-center px-[16vw]">
      <h1 className="w-full font-title text-8xl font-bold text-white">
        {'Virtual labs for\nexploring, building and\nsimulating the brain'}
      </h1>

      <div className="mt-10 grid w-full grid-cols-3 gap-x-4">
        {THREE_COLUMN_SCREEN_ONE.map((paragraph: string, index: number) => (
          <div
            className="flex flex-col gap-y-2 font-title text-xl font-normal text-white"
            key={`Subtitle-${index + 1}`}
          >
            <div>{index + 1}</div>
            <h2>{paragraph}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
