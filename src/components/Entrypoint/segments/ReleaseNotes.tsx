import kebabCase from 'lodash/kebabCase';
import Link from 'next/link';
import Image from 'next/image';
import { PlusOutlined } from '@ant-design/icons';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';
import { EyeIcon } from '@/components/icons';

const RELEASE_NOTES_SAMPLE = [
  {
    image: '',
    release: 'Latest release (v0.04)',
    title: '340 new morphologies added',
    seeable: false,
  },
  {
    image: '',
    release: 'Latest release (v0.04)',
    title: '340 new morphologies added',
    seeable: true,
  },
  {
    image: '',
    release: 'Latest release (v0.04)',
    title: '340 new morphologies added',
    seeable: true,
  },
  {
    image: '',
    release: 'Latest release (v0.04)',
    title: '340 new morphologies added',
    seeable: true,
  },
];

function ReleaseNote({
  image,
  release,
  title,
  seeable,
}: {
  image: string;
  release: string;
  title: string;
  seeable: boolean;
}) {
  return (
    <div
      className={classNames(
        'group inline-flex cursor-pointer flex-row items-start bg-primary-9 p-2',
        'border border-solid border-[rgba(255,255,255,0.20)] backdrop-blur-[2px]',
        'hover:rounded-sm hover:bg-primary-8 hover:shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px]'
      )}
    >
      <Image
        src={image.length ? image : `${basePath}/images/obp_fullbrain.png`}
        alt={title}
        className="h-auto w-32 flex-shrink-0 flex-grow-0"
        width={984}
        height={927}
      />
      <div className="flex flex-1 basis-3/5 flex-col items-start gap-y-1 p-4">
        <div className="line-clamp-1 text-sm font-light text-white">{release}</div>
        <h4 className="mb-3 line-clamp-2 text-xl font-bold text-white">{title}</h4>
        {seeable && <EyeIcon className="mt-auto h-4 w-4 text-white" />}
      </div>
    </div>
  );
}

export default function ReleaseNotes() {
  return (
    <div className="relative z-20 mt-auto flex w-full flex-col">
      <div className="mb-4 inline-flex w-full flex-row items-center justify-between">
        <h2 className="select-none text-lg font-bold text-white">Release notes</h2>
        <Link
          href="/about/releases"
          type="button"
          className="inline-flex flex-row items-center gap-2"
        >
          <span className="text-base font-bold text-white">All release notes</span>
          <PlusOutlined className="h-3 w-3 text-white" />
        </Link>
      </div>
      <div className="grid grid-flow-col items-stretch gap-2">
        {RELEASE_NOTES_SAMPLE.map(({ image, release, seeable, title }, ind) => (
          <ReleaseNote
            key={kebabCase(`${release}-${title}-${ind}`)}
            {...{ image, release, seeable, title }}
          />
        ))}
      </div>
    </div>
  );
}
