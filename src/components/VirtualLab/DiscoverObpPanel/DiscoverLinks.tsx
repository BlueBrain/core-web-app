import Link from 'next/link';

type Props = {
  topLink: string;
  topText: string;
  bottomLink: string;
  bottomText: string;
};

export default function DiscoverLinks({ topLink, topText, bottomLink, bottomText }: Props) {
  return (
    <div className="flex w-full flex-col gap-[2px]">
      <Link
        href={topLink}
        className="inline-block w-full bg-white p-4 font-semibold text-primary-8"
      >
        {topText}
      </Link>
      <Link
        href={bottomLink}
        className="inline-block w-full bg-primary-7 p-4 font-semibold text-white"
      >
        {bottomText}
      </Link>
    </div>
  );
}
