import Link from 'next/link';
import { LinkItem } from '../VerticalLinks';

type Props = {
  links: LinkItem[];
  current?: string;
};

export default function SideMenu({ links, current }: Props) {
  return (
    <div className="flex h-full w-[40px] flex-col items-center border-r border-primary-7 pt-2">
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
            className={current === link.key ? `rounded-full bg-primary-5 p-2 text-primary-9` : ''}
          >
            {link.content}
          </Link>
        ))}
      </div>
    </div>
  );
}
