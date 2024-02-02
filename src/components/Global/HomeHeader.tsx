import Link from 'next/link';
import { ArrowLeftIcon } from '../icons';

type HomeHeaderProps = {
  title: string;
  description: string;
  link?: string;
  buttonLabel?: string;
};

export default function HomeHeader({
  title,
  description,
  link = '/',
  buttonLabel = 'Back home',
}: HomeHeaderProps) {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-1/3 flex-col p-6">
      <div className="flex flex-col">
        <h1 className="inline text-5xl font-bold text-white">{title}</h1>
        <p className="mt-2 w-2/3 font-thin leading-5 text-primary-2">{description}</p>
        <Link href={link}>
          <button
            type="button"
            className="ease-liner mt-4 flex flex-row items-center border border-primary-2 bg-transparent px-6 py-4 text-sm uppercase tracking-wider text-primary-2 transition-all duration-300 hover:bg-primary-2 hover:text-primary-9"
          >
            <ArrowLeftIcon className="h-2.5 w-auto" />
            <div className="ml-2 block">{buttonLabel}</div>
          </button>
        </Link>
      </div>
    </div>
  );
}
