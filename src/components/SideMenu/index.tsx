import Link from 'next/link';
import { HomeOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';

type Props = {
  links: LinkItem[];
  current?: string;
  home?: LinkItem;
};

export default function SideMenu({ links, current, home }: Props) {
  return (
    <div className="flex h-full w-[40px] flex-col items-center justify-between border-r border-primary-7 px-7 py-2 text-lg font-semibold">
      <div
        className="my-5 flex items-center gap-x-3.5 text-white"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
      >
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={
              current === link.key
                ? `rounded-full bg-primary-5 p-2 capitalize text-primary-9`
                : 'capitalize'
            }
          >
            {link.content}
          </Link>
        ))}
      </div>
      {home && (
        <div className="text-primary-3">
          <Link
            key={home.key}
            href={home.href}
            className="capitalize"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              cursor: 'e-resize',
            }}
          >
            {home.content}
          </Link>
          <Link href={home.href} className="pl-[6px]">
            <HomeOutlined />
          </Link>
        </div>
      )}
    </div>
  );
}
