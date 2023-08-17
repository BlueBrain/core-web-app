import Link from 'next/link';
import { ArrowLeftIcon } from '../icons';

type HomeHeaderProps = {
  title: string;
  description: string;
  link?: string;
  buttonLabel?: string;
}

export default function HomeHeader({
  title,
  description,
  link = '/',
  buttonLabel = 'Back home'
}:HomeHeaderProps) {
  return (
    <div className="fixed z-10 top-0 left-0 w-1/3 h-full flex flex-col p-6">
      <div className="flex flex-col">
        <h1 className="text-white text-5xl font-bold inline">{title}</h1>
        <p className="mt-2 font-thin leading-5 text-primary-2 w-2/3">{description}</p>
        <Link href={ link }>
          <button
            type="button"
            className="flex flex-row items-center bg-transparent text-sm text-primary-2 border border-primary-2 py-4 px-6 mt-4 uppercase tracking-wider transition-all ease-liner duration-300 hover:bg-primary-2 hover:text-primary-9"
          >
            <ArrowLeftIcon className="w-auto h-2.5" />
            <div className="block ml-2">{ buttonLabel }</div>
          </button>
        </Link>
      </div>
    </div>
  );
}
