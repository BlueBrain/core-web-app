'use client';

import Image from 'next/image';

import { useInView } from 'react-intersection-observer';

import { basePath } from '@/config';
import { SCREEN_TWO } from '@/constants/home/content-home';

export default function ScreenBBGithub() {
  const { ref, inView } = useInView({
    threshold: 0.9,
  });

  return (
    <div
      className="relative flex h-screen w-screen snap-start snap-always flex-col items-center justify-center gap-y-6 px-[16vw] text-white"
      ref={ref}
    >
      <div className="relative z-10 flex flex-col gap-y-8">
        <h3 className="font-title text-7xl font-bold">{SCREEN_TWO.title}</h3>
        <div className="grid grid-cols-2 gap-x-6">
          {SCREEN_TWO.content.map((content: { title: string; paragraph: string }) => (
            <div className="flex flex-col gap-y-2 font-title" key={content.title}>
              <h4 className="text-2xl font-semibold uppercase tracking-wider">{content.title}</h4>
              <p className="text-lg leading-normal">{content.paragraph}</p>
            </div>
          ))}
        </div>
      </div>
      <Image
        src={`${basePath}/images/home/home_background_block-1.webp`}
        alt="Image of the hippocampus illustrating the Blue Brain Open Platform"
        width={1920}
        height={1080}
        className="absolute -bottom-2 right-0 z-0 h-full w-full origin-bottom object-cover transition-all duration-300 ease-in-out"
        style={{
          transform: inView ? 'scale(1.05)' : 'scale(1)',
          opacity: inView ? 1 : 0.6,
        }}
      />
    </div>
  );
}
