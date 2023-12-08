import Link from 'next/link';
import Image from 'next/image';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';
import { ObpLogo } from '@/components/icons/ObpLogo';

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
    <div className="absolute z-20 top-1/2 -translate-y-1/2 lg:left-10percent items-center justify-center">
      <div className="whitespace-pre-line text-left select-none text-white text-4xl xl:text-7xl 2xl:text-9xl font-bold">{`Leveraging\nsimulation\nneuroscience `}</div>
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
      className={classNames('z-10 flex flex-col justify-center pr-4 h-auto', color, className)}
    >
      <ObpLogo />
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
