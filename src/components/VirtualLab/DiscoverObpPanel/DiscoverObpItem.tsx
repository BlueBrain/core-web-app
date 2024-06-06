'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

type Props = {
  imagePath: string;
  title: string;
  body: ReactNode | string;
  bottomElement: ReactNode;
};

export default function DiscoverObpItem({ imagePath, title, body, bottomElement }: Props) {
  return (
    <div className="flex flex-1">
      <div className="relative top-[-60px]">
        <Image
          src={imagePath}
          width={1158}
          height={794}
          alt="Circular"
          className="relative left-1/2 z-50 h-32 w-32 -translate-x-1/2 translate-y-1/2 transform rounded-full"
        />
        <div className="rounded-none bg-white p-10 pt-20" style={{ height: '450px' }}>
          <div className="flex flex-col">
            <div className="text-lg uppercase text-neutral-7">{title}</div>
            <div className="my-8 text-primary-8">{body}</div>
          </div>
        </div>
        <div className="mt-[2px] flex flex-col gap-2">{bottomElement}</div>
      </div>
    </div>
  );
}
