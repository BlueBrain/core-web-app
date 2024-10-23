import Link from 'next/link';

import { CONTRIBUTORS } from '@/constants/home/content-home';

export function SingleContributorCard({ name, link }: { name: string; link: string }) {
  return (
    <Link href={link} className="relative font-sans text-xl font-semibold text-white">
      <div className="relative z-10">{name}</div>
      <div className="absolute left-0 z-0 h-12 w-24 -translate-x-8 -translate-y-[32px] bg-primary-6" />
    </Link>
  );
}

export default function ScreenContributors() {
  return (
    <div className="relative flex min-h-screen w-screen snap-start snap-always flex-col items-center gap-y-6 px-[16vw] pt-[24vh]">
      <div className="grid w-full grid-cols-2 gap-x-6 font-title">
        <h3 className="text-7xl font-bold text-white">{CONTRIBUTORS.title}</h3>
        <h4 className="text-4xl font-normal text-primary-2">{CONTRIBUTORS.subtitle}</h4>
      </div>
      <div className="relative left-8 mt-20 grid w-full grid-cols-4 gap-x-4 gap-y-20">
        {CONTRIBUTORS.contributors.map((contributor: { name: string; link: string }, index) => (
          <SingleContributorCard
            key={`Contributor_Card_${index + 1}`}
            name={contributor.name}
            link={contributor.link}
          />
        ))}
      </div>
    </div>
  );
}
