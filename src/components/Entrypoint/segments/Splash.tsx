import Link from 'next/link';
import Image from 'next/image';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';

export function Background() {
  return (
    <Image
      fill
      priority
      src={`${basePath}/images/obp_home_background.webp`}
      alt="Open Brain Platform Full Brain"
      className="absolute inset-0 bg-primary-9 object-cover"
    />
  );
}

function HeroText() {
  return (
    <div className="absolute top-1/2 z-20 -translate-y-1/2 items-center justify-center lg:left-10percent">
      <div className="select-none whitespace-pre-line text-left text-4xl font-bold text-white xl:text-7xl 2xl:text-9xl">{`Leveraging\nsimulation\nneuroscience `}</div>
    </div>
  );
}

export function OBPLogo({
  color = 'text-white',
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={classNames('z-10 flex h-auto flex-col justify-center pr-4', color, className)}
    >
      <div className="flex flex-col text-4xl font-bold">
        <span>Blue</span>
        <span>Brain</span>
        <span>Open</span>
        <span>Platform</span>
      </div>
    </Link>
  );
}

export default function Splash() {
  return (
    <>
      <Background />
      <HeroText />
    </>
  );
}
