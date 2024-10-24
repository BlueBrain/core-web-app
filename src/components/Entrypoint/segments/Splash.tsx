import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';

// export function Background() {
//   return (
//     <Image
//       fill
//       priority
//       src={`${basePath}/images/obp_home_background.webp`}
//       alt="Open Brain Platform Full Brain"
//       className="absolute inset-0 z-0 bg-primary-9 object-cover"
//     />
//   );
// }

function HeroText() {
  return (
    <div className="absolute top-1/2 z-20 -translate-y-1/2 items-center justify-center lg:left-10percent">
      <h1 className="select-none whitespace-pre-line text-left text-2xl font-bold text-white xl:text-7xl 2xl:text-9xl">
        {'Virtual labs for\nexploring, building and\nsimulating the brain'}
      </h1>
      <Link
        className="mt-10 flex h-auto w-[500px] justify-between rounded-none border border-primary-7 bg-transparent py-8 text-sm font-bold"
        href="/log-in"
        prefetch={false}
      >
        <span className="pl-4 text-4xl text-white">Log in</span>
        <ArrowRightOutlined className="pr-4 text-4xl text-white" />
      </Link>
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
      className={classNames(
        'z-10 flex h-auto flex-col justify-center pr-4 outline-none',
        color,
        className
      )}
    >
      <Image priority width={192} height={61} alt="bbop" src={`${basePath}/images/logo.png`} />
    </Link>
  );
}

export default function Splash() {
  return (
    <>
      <HeroText />
    </>
  );
}
