import Image from 'next/image';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';

export function Background() {
  return (
    <div className="absolute inset-0 z-0 bg-primary-9 flex flex-col items-center justify-center">
      <Image
        fetchPriority="high"
        src={`${basePath}/images/obp_fullbrain.png`}
        alt="Open Brain Platform Full Brain"
        width={1334}
        height={1255}
        className="block w-[42%] h-auto mb-[76px]"
      />
    </div>
  );
}

function HeroText() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
      <div className="whitespace-pre-line text-center select-none text-white text-7xl font-bold">{`From models building to\nsimulation experiments`}</div>
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
    <div className={classNames('fixed top-7 left-7 z-10 pr-2', className)}>
      <h1
        className={classNames(
          'whitespace-pre-line text-left text-[2.4rem] leading-[90.5%] font-extrabold uppercase p-1 tracking-wider select-none',
          color
        )}
      >{`Open\nBrain\nPlatform`}</h1>
    </div>
  );
}

export default function Splash() {
  return (
    <>
      <Background />
      <HeroText />
      <OBPLogo />
    </>
  );
}
