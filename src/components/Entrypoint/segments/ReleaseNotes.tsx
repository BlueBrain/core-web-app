import { kebabCase } from 'lodash/fp';
import Link from 'next/link';
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
        'inline-flex flex-row items-start bg-primary-9 group cursor-pointer p-2',
        'border backdrop-blur-[2px] border-solid border-[rgba(255,255,255,0.20)]',
        'hover:shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] hover:bg-primary-8 hover:rounded-sm'
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.length ? image : `${basePath}/images/obp_fullbrain.png`}
        alt={title}
        className="w-32 h-auto flex-grow-0 flex-shrink-0"
      />
      <div className="flex flex-col items-start gap-y-1 flex-1 basis-3/5 p-4">
        <div className="font-light text-sm text-white line-clamp-1">{release}</div>
        <h4 className="font-bold text-xl line-clamp-2 text-white mb-3">{title}</h4>
        {seeable && <EyeIcon className="w-4 h-4 text-white mt-auto" />}
      </div>
    </div>
  );
}

export default function ReleaseNotes() {
  return (
    <div className="flex flex-col w-full relative mt-auto px-7 z-20">
      <div className="inline-flex flex-row items-center justify-between w-full mb-4">
        <h2 className="font-bold text-lg text-white select-none">Release notes</h2>
        <Link
          href="/about/release-notes"
          type="button"
          className="inline-flex flex-row gap-2 items-center"
        >
          <span className="text-white text-base font-bold">All release notes</span>
          <PlusOutlined className="text-white w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-flow-col items-stretch justify-between gap-2">
        {RELEASE_NOTES_SAMPLE.map(({ image, release, seeable, title }) => (
          <ReleaseNote
            key={kebabCase(`${release}-${title}`)}
            {...{ image, release, seeable, title }}
          />
        ))}
      </div>
    </div>
  );
}
