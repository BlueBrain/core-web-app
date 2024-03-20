'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  imagePath: string;
  title: string;
  subtitle: string;
  body: ReactNode | string;
  buttonText: string;
  buttonHref: string;
};

export default function DiscoverObpItem({
  imagePath,
  title,
  subtitle,
  body,
  buttonText,
  buttonHref,
}: Props) {
  const router = useRouter();
  return (
    <div className="relative top-[-60px] w-96">
      <Image
        src={imagePath}
        width={1158}
        height={794}
        alt="Circular"
        className="relative left-1/2 z-50 h-32 w-32 -translate-x-1/2 translate-y-1/2 transform rounded-full"
      />
      <div className="rounded-md bg-white p-5 pt-20">
        <div className="flex flex-col">
          <div className="uppercase text-neutral-4">{title}</div>
          <div className="text-2xl font-bold text-primary-8">{subtitle}</div>
          <div className="my-8 text-primary-8">{body}</div>
          <button
            type="button"
            className="border p-3 text-primary-8"
            onClick={() => {
              router.push(buttonHref);
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
